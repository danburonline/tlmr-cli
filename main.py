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
        print(response["choices"][0]["text"])


paperContent = pdfplumber.open("example.pdf").pages
show_paper_summary(paperContent)
