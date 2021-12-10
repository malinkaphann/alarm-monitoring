import { Theme } from 'theme-ui';

export const theme = {
    fonts: {
        body: 'system-ui, sans-serif',
        heading: '"Avenir Next", sans-serif',
        monospace: 'Menlo, monospace',
    },
    colors: {
        text: '#000',
        background: '#fff',
        primary: 'red',
    },
    cards: {
        default: {
            m: 2,
            padding: 2,
            borderRadius: 4,
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
        },
        critical: {
            variant: "cards.default",
            color: 'white',
            bg: 'red'
        },
        major: {
            variant: "cards.default",
            color: 'white',
            bg: 'magenta'
        },
        minor: {
            variant: "cards.default",
            color: 'black',
            bg: 'cyan'
        }
    }
}