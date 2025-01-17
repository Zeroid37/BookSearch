import torch
from sklearn.model_selection import train_test_split
from torch.nn.utils.rnn import pad_sequence
from torchtext.vocab import build_vocab_from_iterator
from torchtext.data.utils import get_tokenizer
import pandas as pd
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

######################### Preprocessing #########################
df = pd.read_csv('old_dataset.csv', sep=";")
titles = df['Title'].tolist()
labels = df['Label'].tolist()  # 0 = fake, 1 = real

tokenizer = get_tokenizer('basic_english')
tokenized_titles = [tokenizer(title) for title in titles]

vocab = build_vocab_from_iterator(tokenized_titles, specials=["<pad>", "<unk>"])
vocab.set_default_index(vocab["<unk>"])

def encode_text(text):
    return torch.tensor([vocab[token] for token in tokenizer(text)])

encoded_titles = [encode_text(title) for title in titles]
labels = torch.tensor(labels, dtype=torch.long)

padded_titles = pad_sequence(encoded_titles, batch_first=True)

X_train, X_test, y_train, y_test = train_test_split(padded_titles, labels, test_size=0.2, random_state=42)


######################### Defining model #########################
class BookTitleClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim):
        super(BookTitleClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers=2, dropout=0.3, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        x = self.embedding(x)
        _, (hidden, _) = self.lstm(x)
        return self.fc(hidden[-1])

vocab_size = len(vocab)
embed_dim = 128
hidden_dim = 64
output_dim = 2  # Binary classification: Fake (0) or Real (1)
batch_size = 32
epochs = 10
learning_rate = 0.001

model = BookTitleClassifier(vocab_size, embed_dim, hidden_dim, output_dim)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

train_data = TensorDataset(X_train, y_train)
test_data = TensorDataset(X_test, y_test)

train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_data, batch_size=batch_size)


######################### Training and Evaluation #########################
lossValues = []
for epoch in range(epochs):
    model.train()
    total_loss = 0

    for titles, labels in train_loader:
        outputs = model(titles)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
    lossValues.append(round(total_loss/len(train_loader), 4))

    print(f"Epoch {epoch + 1}/{epochs}, Loss: {total_loss / len(train_loader):.4f}")

model.eval()
predictions, actuals = [], []

with torch.no_grad():
    for titles, labels in test_loader:
        outputs = model(titles)
        preds = torch.argmax(outputs, dim=1)
        predictions.extend(preds.tolist())
        actuals.extend(labels.tolist())

accuracy = accuracy_score(actuals, predictions)
print(f"Test Accuracy: {accuracy * 100:.2f}%")


def predict_title(title):
    model.eval()
    encoded = encode_text(title).unsqueeze(0)
    padded = pad_sequence([encoded], batch_first=True)
    padded = padded.squeeze(0)
    with torch.no_grad():
        output = model(padded)
        prediction = torch.argmax(output, dim=1).item()
    return "Real" if prediction == 1 else "Fake"

# Example
print(predict_title("The Lord of the Rings"))
print(predict_title("Secret Alien Love Chronicles"))


######################### Plot data #########################
plt.plot(range(1, epochs+1), lossValues, label="Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training Loss")
plt.legend()
plt.ylim(0, 1)
plt.xticks(range(1, epochs + 1))
plt.show()
print(lossValues[0:10])
