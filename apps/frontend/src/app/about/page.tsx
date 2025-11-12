import { MarkdownRenderer } from "@/components/MarkdownRenderer";

const Page = () => {
  return (
    <div>
      <MarkdownRenderer
        content={`
# About De Alwetende API

Everyone knows **Suske en Wiske** — the kids, Lambik, Jerom, Tante Sidonia, Professor Barabas, and the rest of Willy Vandersteen’s iconic crew. Hundreds of albums, decades of adventures, and somehow... still no clean, structured way to get the data. Because why would anyone need that? (Spoiler: me!)

**De Alwetende API** is here to fix that. It’s a simple, developer-friendly endpoint to fetch data on **characters**, **albums**, **artists**, and more from the Suske en Wiske universe. Use it to build trivia apps, analyze story arcs, or just settle arguments about who appeared in which album.

This is a personal fan project by **Steven Straatemans**:
- Freelance frontend developer
- Aspiring comic artist
- Long-time Suske en Wiske nerd

Find me on: [LinkedIn](https://www.linkedin.com/in/steven-straatemans-1a69a627/), [X/Twitter](https://x.com/Straatemans), [GitHub](https://github.com/sstraatemans)

Data not perfect? Missing something? Found a bug? Or just want to say hi?  
Leave an issue here: [github.com/sstraatemans/playground/issues](https://github.com/sstraatemans/playground/issues)

        `}
      />
    </div>
  );
};

export default Page;
