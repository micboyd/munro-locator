module.exports = {
	theme: {
		extend: {
			keyframes: {
				loader: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
			},
			colors: {
				midnight: "rgb(var(--tw-midnight, 1) / <alpha-value>)",
				lionsmane: "rgb(var(--tw-lionsmane, 1) / <alpha-value>)",
				celeste: "rgb(var(--tw-celeste, 1) / <alpha-value>)",
				herb: "rgb(var(--tw-herb, 1) / <alpha-value>)",
				marigold: "rgb(var(--tw-marigold, 1) / <alpha-value>)",
			},
			animation: {
				loader: 'loader 2s linear infinite',
			},
		},
	},
};
