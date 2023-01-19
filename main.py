"""Generate summaries in the terminal for papers"""
import os
import openai
import pdfplumber
from dotenv import load_dotenv

load_dotenv()


def show_paper_summary(paper_content):
    """Display the paper summary in the terminal"""

    tldr_tag = "\n tl;dr:"  # Needed for the prompt
    raw_pdf_text = ""  # Used to concatenate all the text from the PDF
    text_blocks = []  # Used to split the text into blocks of 2048 characters
    response_list = []  # Used to store the responses from OpenAI

    # If the user has not entered the API key, ask for it
    if os.environ.get("OPENAI_API_KEY") is None:
        os.environ["OPENAI_API_KEY"] = input("Enter your OpenAI API key here: ")

        # After the user enters the API key, save it to the `.env` file
        with open(".env", "a", encoding="utf-8") as file_name:
            file_name.write(f"OPENAI_API_KEY={os.environ.get('OPENAI_API_KEY')}")
    openai.api_key = os.environ.get("OPENAI_API_KEY")

    # Loop through the pages in the PDF and concatenate all text
    for page in paper_content:
        raw_pdf_text += page.extract_text()

    # Remove the bibliography and references sections
    raw_pdf_text = raw_pdf_text.split("Bibliography")[0]
    raw_pdf_text = raw_pdf_text.split("References")[0]

    for i in range(0, len(raw_pdf_text), 2048):
        text_block = raw_pdf_text[i : i + 2048]
        text_blocks.append(text_block)

    # Loop through the text blocks and generate a summary for each one
    for text_block in text_blocks:
        prompt = text_block + tldr_tag
        response = openai.Completion.create(
            engine="davinci",
            prompt=prompt,
            temperature=0.3,
            max_tokens=140,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\n"],
        )
        # Add the response to the list
        response_list.append(response["choices"][0]["text"])

    # Print the summary title in bold
    print("\033[1m" + "Paper Summary:" + "\033[0m")

    # Print the summary at the end all at once
    for response in response_list:
        print(response)


# Loop through all the PDFs in the current directory
for file in os.listdir():
    if file.endswith(".pdf"):
        paperContent = pdfplumber.open(file).pages
        show_paper_summary(paperContent)
