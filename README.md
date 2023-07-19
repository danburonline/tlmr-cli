# Too Long, Might Read

Too Long, Might Read (TLMR) is a CLI tool that uses GPT4 to generate summaries of scientific papers. It targets papers formatted in the [IMRaD](https://en.wikipedia.org/wiki/IMRAD) structure. Just point TLMR to a directory containing your PDFs, and it will do the rest!

## Installation

### Prerequisites

- OpenAI API key
- Bun `>= 0.6.14`

### Steps

1. Clone this repository.
2. Install dependencies with `bun install`.
3. Create a `.env` file in the root directory of the project and add your OpenAI API key:

```txt
OPENAI_API_KEY=<your OpenAI API key>
```

Alternatively, when running the tool, you can pass your API key via the `-k` flag.

## Build

To build the project, use Bun to compile the TypeScript:

```bash
bun build ./src/main.ts --compile --outfile tlmr
```

This will create an executable called `tlmr` in the project's root directory.

## Usage

After building, you can run the tool with the following command:

```bash
./tlmr -f <path to folder with PDFs or single PDF>
```

If you opted not to use the .env file, pass the API key via the `-k` flag:

```bash
./tlmr -f <path to folder with PDFs or single PDF> -k <your OpenAI API key>
```

## Development

During development, you can use Bun to run the script directly:

```bash
bun run start -f <path to folder with PDFs or single PDF>
```

Or with the API key:

```bash
bun run start -f <path to folder with PDFs or single PDF> -k <your OpenAI API key>
```

## More About TLMR

TLMR uses [LangChain.js](https://js.langchain.com) to communicate with the OpenAI API. The main logic is in [`src/main.ts`](./src/main.ts).

This project uses [Bun](https://bun.sh) instead of Node. By using Bun, we can write in TypeScript without needing a separate transpiler like Babel. Plus, it's a great opportunity to explore the capabilities of Bun, a promising tool for JavaScript/TypeScript development.

To get started, check out the example PDF in the example folder. There is also an [`.env.template`](.env.template) file in the project's root directory. Use this template to create your own `.env` file.

Happy summarising!
