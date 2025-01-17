import random
import csv

# Define components for fake book title generation
adjectives = ["Amazing", "Bizarre", "Curious", "Dancing", "Flying", "Golden", "Invisible", "Mysterious", "Wacky", "Whimsical", "Intriguing", "Elusive", "Imaginative", "Triumphant", "Twisted", "Unexpected", "Faithful", "Confused", "Crooked", "Roomy", "Flimsy", "Handy", "Impartial", "Harsh", "Oceanic", "Hospitable", "Consistent", "Military", "Purring", "Beneficial", "Fanatical", "Juvenile", "Observant", "Stupendous", "Wasteful", "Former", "Extra-small", "Ambitious", "Loving", "Friendly", "Spotty", "Bustling", "Zonked", "Educated", "Hanging", "Possessive", "Voracious", "Lucky", "Innate", "Adjoining", "Deafening", "Tenuous", "Vigorous", "Inner", "Wacky", "Mysterious", "Bent", "Marvelous", "Cowardly", "Shiny", "Abnormal", "Omniscient", "Cagey", "Perfect", "Quirky"]
nouns = ["Banana", "Dragon", "Microwave", "Penguin", "Robot", "Spaceship", "Toast", "Wizard", "Yeti", "Zombie", "Mole", "Guitar", "Desk", "Jeep", "Refrigerator", "Security", "Interaction", "Region", "Election", "Software", "World", "Throat", "Instance", "Clothes", "Engineering", "Assistant", "Version", "History", "Employer", "Climate", "Literature", "Death", "Outcome", "Affair", "Family", "Reception", "Responsibility", "Length", "Gate", "Pizza", "Phone", "Importance", "Energy", "Hearing", "Ability", "Farmer", "King", "Mixture", "Cigarette", "Possibility", "Context", "Attention", "Disk", "Foundation", "Mom", "Paper", "Decision", "Passion", "Contract", "Magazine", "Steak", "Assumption", "Article", "Recommendation", "Concept"]
verbs = ["Bake", "Train", "Escape", "Build", "Discover", "Uncover", "Tame", "Summon", "Destroy", "Grow", "Defeat", "Break", "Encounter", "Paint", "Gather", "Hunt", "Scatter", "Bounce", "Swear", "Expect", "Enjoy", "Mutter", "Phone", "Select", "Dislike", "Campaign", "Handle", "Focus", "Look", "Release", "Fling", "Order", "Recognize", "Attack", "Collect", "Enable", "Claim", "Discuss", "Render", "Withdraw", "Reverse", "Interrupt", "Cause", "Lift", "Earn", "Fulfil", "Formulate", "Drift", "Represent", "Precede", "Score", "Balance", "Vary", "Resolve", "Crush", "Integrate", "Dominate", "Follow", "Hire", "Stage", "Tip", "View", "Rebuild", "Stress", "Communicate", "Stem"]
formats = [
    "The {adjective} {noun}",
    "How to {verb} a {noun}",
    "The Chronicles of the {adjective} {noun}",
    "Adventures in {noun} Land",
    "{verb}ing the {adjective} {noun}",
    "{noun} and the {adjective} Quest",
    "Tales of a {adjective} {noun}",
    "The Secret of the {noun}",
    "{adjective} {noun}: A Memoir",
    "The Legend of the {adjective} {noun}",
    "Diary of a {adjective} {noun}",
    "Escape from the {adjective} {noun}",
    "Journey to the {adjective} {noun}",
    "The Curse of the {adjective} {noun}",
    "My Life as a {adjective} {noun}",
    "The Last {adjective} {noun}",
    "Chronicles of {adjective} {noun} Kingdom",
    "A Guide to {verb}ing the {noun}",
    "Memoirs of a {adjective} {noun}",
    "The Rise and Fall of the {adjective} {noun}"
]


def generate_fake_titles(num_titles):
    fake_titles = []
    for x in range(num_titles):
        template = random.choice(formats)
        title = template.format(
            adjective=random.choice(adjectives),
            noun=random.choice(nouns),
            verb=random.choice(verbs)
        )
        fake_titles.append(title)
    return fake_titles


def save_to_csv(titles, file_path):
    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerow(["Title", "Label"])
        for title in titles:
            writer.writerow([title, 0])  # Label 0 for fake titles


if __name__ == "__main__":
    number_of_titles = 10000
    generated_fake_titles = generate_fake_titles(number_of_titles)

    csv_path = "fake_book_titles.csv"

    save_to_csv(generated_fake_titles, csv_path)
    print(f"Dataset with {number_of_titles} fake titles saved to {csv_path}")
