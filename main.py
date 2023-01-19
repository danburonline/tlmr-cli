"""Generate summaries in the terminal for papers."""
import os
import openai
import pdfplumber
from dotenv import load_dotenv

load_dotenv()


def show_paper_summary(paper_content):
    """
    Display the paper summary in the terminal.
    """
    tldr_tag = "\n tl;dr:"

    # If the user has not entered the API key, ask for it
    if os.environ.get("OPENAI_API_KEY") is None:
        os.environ["OPENAI_API_KEY"] = input("Enter your OpenAI API key here: ")

        # After the user enters the API key, save it to the `.env` file
        with open(".env", "a", encoding="utf-8") as file_name:
            file_name.write(f"OPENAI_API_KEY={os.environ.get('OPENAI_API_KEY')}")
    openai.api_key = os.environ.get("OPENAI_API_KEY")

    for page in paper_content:
        text = page.extract_text() + tldr_tag
        response = openai.Completion.create(
            engine="davinci",
            prompt=text,
            temperature=0.3,
            max_tokens=140,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\n"],
        )
        print("\033[1m" + "Paper Summary:" + "\033[0m")
        print(response["choices"][0]["text"])


for file in os.listdir():
    if file.endswith(".pdf"):
        paperContent = pdfplumber.open(file).pages
        show_paper_summary(paperContent)
