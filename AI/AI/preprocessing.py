import torch
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, Dataset
from torch.nn.utils.rnn import pad_sequence
from torchtext.vocab import build_vocab_from_iterator
from torchtext.data.utils import get_tokenizer
import pandas as pd
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import TensorDataset, DataLoader
from sklearn.metrics import accuracy_score

######################### Step 1: Preprocessing #########################
# Load your dataset
df = pd.read_csv('titles.csv', sep=";")  # Replace with your dataset path
titles = df['Title'].tolist()
labels = df['Label'].tolist()  # 0 = fake, 1 = real

# Tokenization
tokenizer = get_tokenizer('basic_english')
tokenized_titles = [tokenizer(title) for title in titles]

# Vocabulary
vocab = build_vocab_from_iterator(tokenized_titles, specials=["<pad>", "<unk>"])
vocab.set_default_index(vocab["<unk>"])

# Convert text to tensor
def encode_text(text):
    return torch.tensor([vocab[token] for token in tokenizer(text)])

encoded_titles = [encode_text(title) for title in titles]
labels = torch.tensor(labels, dtype=torch.long)

# Padding sequences
padded_titles = pad_sequence(encoded_titles, batch_first=True)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(padded_titles, labels, test_size=0.2, random_state=42)


######################### Step 2: Defining the model #########################
class BookTitleClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim):
        super(BookTitleClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers=2, dropout=0.3, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        x = self.embedding(x)
        _, (hidden, _) = self.lstm(x)
        return self.fc(hidden[-1])  # Final hidden state

# Hyperparameters
vocab_size = len(vocab)
embed_dim = 128
hidden_dim = 128
output_dim = 2  # Binary classification: Fake (0) or Real (1)
batch_size = 32
epochs = 25
learning_rate = 0.001

# Model, loss, and optimizer
model = BookTitleClassifier(vocab_size, embed_dim, hidden_dim, output_dim)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Create datasets
train_data = TensorDataset(X_train, y_train)
test_data = TensorDataset(X_test, y_test)

# Create data loaders
train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_data, batch_size=batch_size)


######################### Step 3: Training and Evaluation #########################
for epoch in range(epochs):
    model.train()  # Set to training mode
    total_loss = 0

    for titles, labels in train_loader:
        outputs = model(titles)  # Forward pass
        loss = criterion(outputs, labels)  # Compute loss

        optimizer.zero_grad()  # Clear previous gradients
        loss.backward()  # Backpropagation
        optimizer.step()  # Update weights

        total_loss += loss.item()

    print(f"Epoch {epoch + 1}/{epochs}, Loss: {total_loss / len(train_loader):.4f}")

model.eval()  # Set to evaluation mode
predictions, actuals = [], []

with torch.no_grad():
    for titles, labels in test_loader:
        outputs = model(titles)
        preds = torch.argmax(outputs, dim=1)  # Get predicted class
        predictions.extend(preds.tolist())
        actuals.extend(labels.tolist())

accuracy = accuracy_score(actuals, predictions)
print(f"Test Accuracy: {accuracy * 100:.2f}%")


def predict_title(title):
    model.eval()
    encoded = encode_text(title).unsqueeze(0)  # Add batch dimension
    padded = pad_sequence([encoded], batch_first=True)
    padded = padded.squeeze(0)# Pad input
    with torch.no_grad():
        output = model(padded)
        prediction = torch.argmax(output, dim=1).item()
    return "Real" if prediction == 1 else "Fake"

# Example
print(predict_title("The Great Gatsby"))
print(predict_title("Secret Alien Love Chronicles"))


######################### Step 4: Save the Model #########################
