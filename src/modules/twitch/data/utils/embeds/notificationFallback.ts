import Handlebars from 'handlebars';

export default Handlebars.compile(JSON.stringify({
    title: "{{stream_title}}",
    author: {
        name:   "{{display_name}}",
        url:    "{{stream_url}}",
        icon_url: "{{stream_thumbnail_url}}",
    },
    url: `{{stream_url}}`,
    color: 10180863,
    fields: [
        {
            name: "Game",
            value: "{{game_name}}",
            inline: true
        },
        {
            name: "Started",
            value: "{{{started_at}}}",
            inline: true
        },
    ],
    footer: {
        text: "{{credits}}",
        icon_url: "https://i.postimg.cc/8kXg2LQK/IMG-2666-2.jpg"
    },
    timestamp: `{{timestamp}}`,
    image: {
        url: `{{stream_preview}}`,
    },
    thumbnail: {
        url: `{{stream_thumbnail_url}}`,
    },
}));
