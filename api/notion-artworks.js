import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const response = await notion.databases.query({ database_id: databaseId });

    // Map Notion results to artwork structure
    const artworks = response.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Title.rich_text?.[0]?.plain_text || "",
        description: props.Description.rich_text?.[0]?.plain_text || "",
        images: props.Images.url || "",
        date: props.Date.date?.start || "",
        location: props.Location.rich_text?.[0]?.plain_text || "",
        position: [
          parseFloat(props.Latitude.number),
          parseFloat(props.Longitude.number)
        ],
        tags: props.Tag.multi_select.map(tag => ({ name: tag.name, color: tag.color }))
      };
    });

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}