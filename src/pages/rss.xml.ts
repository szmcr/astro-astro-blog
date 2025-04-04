import type { APIRoute } from "astro";

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

export const GET: APIRoute = async ({ params, request, site }) => {

    const blogPosts = await getCollection('blog')


    return rss({
        // stylesheet: '/styles/rss.xsl',
        // `<title>` field in output xml
        title: 'Santiago Blog',
        // `<description>` field in output xml
        description: 'Un blog sobre Santiago',
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: site ?? '',
        xmlns: {
            media: 'http://search.yahoo.com/mrss/',
        },
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: blogPosts.map(({ data, slug, body }) => ({
            title: data.title,
            pubDate: data.date,
            description: data.description,
            link: `/posts/${slug}`,
            content: sanitizeHtml(parser.render(body), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),

            customData: `<media:content
                  type="image/${data.image.format === 'jpg' ? 'jpeg' : 'png'}"
                  width="${data.image.width}"
                  height="${data.image.height}"
                  medium="image"
                  url="${site + data.image.src}" />
              `,
        })),
        // (optional) inject custom xml
        customData: `<language>es-cr</language>`,
    });
};