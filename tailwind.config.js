/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    safelist: ["dark"],

    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",

        "./vueform.config.ts", // or where `vueform.config.js` is located. Change `.js` to `.ts` if required.
        "./node_modules/@vueform/vueform/themes/tailwind/**/*.vue",
        "./node_modules/@vueform/vueform/themes/tailwind/**/*.js",
    ],
    theme: {

        extend: {

            keyframes: {
                slide: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(calc(-50% - 16px))" },
                }
            },

            animation: {
                "slide": "slide 10s linear infinite",
            },

            backgroundImage: {
                "sisep-tornado": "linear-gradient(180deg, #008751 79.16%, #0D6535 100%)",
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "sisep-hit": "linear-gradient(105.27deg, rgba(22, 34, 51, 1) 1.84%, rgba(17, 132, 90, 1) 110.21%)"
            },

            colors: {
                "permis-base": "#19474b",
                "permis-footer": "#313f41",
                white: "#fff",
                purple: "#3f3cbb",
                midnight: "#121063",
                tahiti: "#3ab7bf",
                bermuda: "#78dcca",

                niagara: {
                    50: "#f1fcf9",
                    100: "#d0f7ee",
                    200: "#a1eedd",
                    300: "#6adec9",
                    400: "#3bc6b2",
                    500: "#22aa98",
                    600: "#1b998b",
                    700: "#186d65",
                    800: "#175852",
                    900: "#184945",
                    950: "#082b2a",
                },

                notation: {
                    50: "#edfff7",
                    100: "#d6ffed",
                    200: "#afffdc",
                    300: "#71ffc3",
                    400: "#2cfca3",
                    500: "#01e684",
                    600: "#00bf6a",
                    700: "#009657",
                    800: "#067547",
                    900: "#064f32",
                    950: "#003620",
                },

                "notation-green": {
                    50: "#f2fbf8",
                    100: "#d3f4e8",
                    200: "#a8e7d1",
                    300: "#74d4b5",
                    400: "#48b999",
                    500: "#2e9e80",
                    600: "#237e67",
                    700: "#1f6655",
                    800: "#1d5245",
                    900: "#1c453b",
                    950: "#0a2520",
                },
            },

            fontFamily: {
                inter: ["Inter Variable", "sans-serif"],
                montserrat: ["Montserrat", "sans-serif"],
                manrope: ["Manrope", "sans-serif"],
            },


        },


    },

    form: (theme) => ({
        primary: "hsl(var(--primary))",
        primaryDarker: "#06ac8b", // defaults to 10% darker primary

        danger: theme("colors.red.500"),
        dangerLighter: theme("colors.red.100"),

        success: theme("colors.green.500"),
        successLighter: theme("colors.green.100"),

        ringColor: "hsl(var(--primary))", // defaults to primary with `ringOpacity` alpha
        ringWidth: theme("ringWidth.0"),
        ringOpacity: 0.4,

        linkColor: "var(--vf-primary)",
        linkDecoration: "none",

        grays: theme("colors.gray"),

        fontSize: {
            base: theme("fontSize.base"),
            sm: theme("fontSize.sm"),
            lg: theme("fontSize.base"),
        },

        smallFontSize: {
            base: theme("fontSize.sm"),
            sm: theme("fontSize")["0.5sm"],
            lg: theme("fontSize.sm"),
        },

        h1FontSize: {
            base: "2.125rem",
            sm: "2.125rem",
            lg: "2.125rem",
        },

        h2FontSize: {
            base: "1.875rem",
            sm: "1.875rem",
            lg: "1.875rem",
        },

        h3FontSize: {
            base: "1.5rem",
            sm: "1.5rem",
            lg: "1.5rem",
        },

        h4FontSize: {
            base: "1.25rem",
            sm: "1.25rem",
            lg: "1.25rem",
        },

        h1MobileFontSize: {
            base: "1.5rem",
            sm: "1.5rem",
            lg: "1.5rem",
        },

        h2MobileFontSize: {
            base: "1.25rem",
            sm: "1.25rem",
            lg: "1.25rem",
        },

        h3MobileFontSize: {
            base: "1.125rem",
            sm: "1.125rem",
            lg: "1.125rem",
        },

        h4MobileFontSize: {
            base: "1rem",
            sm: "1rem",
            lg: "1rem",
        },

        blockquoteFontSize: {
            base: "1rem",
            sm: "0.875rem",
            lg: "1rem",
        },

        lineHeight: {
            base: theme("fontSize.base")[1].lineHeight,
            sm: theme("fontSize.sm")[1].lineHeight,
            lg: theme("fontSize.base")[1].lineHeight,
        },

        headingsLineHeight: {
            base: "1.2",
            sm: "1.2",
            lg: "1.2",
        },

        blockquoteLineHeight: {
            base: "1.5rem",
            sm: "1.25rem",
            lg: "1.5rem",
        },

        smallLineHeight: {
            base: theme("fontSize.sm")[1].lineHeight,
            sm: theme("fontSize")["0.5sm"][1].lineHeight,
            lg: theme("fontSize.sm")[1].lineHeight,
        },

        letterSpacing: {
            base: 0,
            sm: 0,
            lg: 0,
        },

        smallLetterSpacing: {
            base: 0,
            sm: 0,
            lg: 0,
        },

        headingsLetterSpacing: {
            base: 0,
            sm: 0,
            lg: 0,
        },

        blockquoteLetterSpacing: {
            base: 0,
            sm: 0,
            lg: 0,
        },

        gutter: {
            base: theme("width")["4"],
            sm: theme("width")["3"],
            lg: theme("width")["4"],
        },

        inputMinHeight: {
            base: theme("height")["9.5"],
            sm: theme("height")["8.5"],
            lg: theme("height")["11.5"],
        },

        inputPy: {
            base: theme("padding")["1.5"],
            sm: theme("padding")["1.5"],
            lg: theme("padding")["2.5"],
        },

        inputPx: {
            base: theme("padding")["3"],
            sm: theme("padding")["2"],
            lg: theme("padding")["3.5"],
        },

        btnPy: {
            base: theme("padding")["1.5"],
            sm: theme("padding")["1.5"],
            lg: theme("padding")["2.5"],
        },

        btnPx: {
            base: theme("padding")["3.5"],
            sm: theme("padding")["3"],
            lg: theme("padding")["5"],
        },

        btnSmallPy: {
            base: theme("padding")["1"],
            sm: theme("padding")["1"],
            lg: theme("padding")["1.5"],
        },

        btnSmallPx: {
            base: theme("padding")["2.5"],
            sm: theme("padding")["2.5"],
            lg: theme("padding")["3"],
        },

        tagPy: {
            base: "0px",
            sm: "var(--vf-py-tag)",
            lg: "var(--vf-py-tag)",
        },

        tagPx: {
            base: theme("padding")["1.75"],
            sm: "var(--vf-px-tag)",
            lg: "var(--vf-px-tag)",
        },

        groupTabsPy: {
            base: "var(--vf-py-input)",
            sm: "var(--vf-py-input-sm)",
            lg: "var(--vf-py-input-lg)",
        },

        groupTabsPx: {
            base: "var(--vf-px-input)",
            sm: "var(--vf-px-input-sm)",
            lg: "var(--vf-px-input-lg)",
        },

        groupBlocksPy: {
            base: theme("padding")["3"],
            sm: theme("padding")["2.5"],
            lg: theme("padding")["3.5"],
        },

        groupBlocksPx: {
            base: theme("padding")["4"],
            sm: theme("padding")["4"],
            lg: theme("padding")["4"],
        },

        sliderTooltipPy: {
            base: theme("padding")["0.5"],
            sm: theme("padding")["0.25"],
            lg: theme("padding")["0.75"],
        },

        sliderTooltipPx: {
            base: theme("padding")["1.5"],
            sm: theme("padding")["1.25"],
            lg: theme("padding")["2"],
        },

        blockquotePy: {
            base: "0.25rem",
            sm: "0.25rem",
            lg: "0.25rem",
        },

        blockquotePx: {
            base: "0.75rem",
            sm: "0.75rem",
            lg: "0.75rem",
        },

        hrPy: {
            base: "2rem",
        },

        spaceAddon: {
            base: "0px",
            sm: "var(--vf-space-addon)",
            lg: "var(--vf-space-addon)",
        },

        spacecheckbox: {
            base: theme("padding")["1.5"],
            sm: "var(--vf-space-checkbox)",
            lg: "var(--vf-space-checkbox)",
        },

        spaceTags: {
            base: theme("padding")["0.75"],
            sm: "var(--vf-space-tags)",
            lg: "var(--vf-space-tags)",
        },

        spaceStaticTag1: "1rem",
        spaceStaticTag2: "2rem",
        spaceStaticTag3: "3rem",

        floatingTop: {
            base: "0px",
            sm: "0px",
            lg: theme("padding")["2.75"],
        },

        borderWidths: {
            // can be array
            input: theme("borderWidth.DEFAULT"),
            dropdown: [
                "var(--vf-border-width-input-t)",
                "var(--vf-border-width-input-r)",
                "var(--vf-border-width-input-b)",
                "var(--vf-border-width-input-l)",
            ],
            checkbox: [
                "var(--vf-border-width-input-t)",
                "var(--vf-border-width-input-r)",
                "var(--vf-border-width-input-b)",
                "var(--vf-border-width-input-l)",
            ],
            radio: [
                "var(--vf-border-width-input-t)",
                "var(--vf-border-width-input-r)",
                "var(--vf-border-width-input-b)",
                "var(--vf-border-width-input-l)",
            ],
            btn: [
                "var(--vf-border-width-input-t)",
                "var(--vf-border-width-input-r)",
                "var(--vf-border-width-input-b)",
                "var(--vf-border-width-input-l)",
            ],
            toggle: theme("width")["0.5"],
            tag: "1px",
            blockquote: "3px",
        },

        inputRadius: {
            // can be array
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input)",
            lg: "var(--vf-radius-input)",
        },

        btnRadius: {
            // can be array
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        smallRadius: {
            // can be array, applies to: checkbox, tags, slider tooltips
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        largeRadius: {
            //  // can be array, applies to: drag and drop, checkbox & radio group blocks, textarea, native multiselect
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        tagRadius: {
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        checkboxRadius: {
            // can be array
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        sliderRadius: {
            // can be array
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        imageRadius: {
            // can be array
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        galleryRadius: {
            // can be array
            base: "var(--vf-radius-input)",
            sm: "var(--vf-radius-input-sm)",
            lg: "var(--vf-radius-input-lg)",
        },

        bgColors: {
            input: "#ffffff",
            inputHover: "var(--vf-bg-input)",
            inputFocus: "var(--vf-bg-input)",
            inputDanger: "var(--vf-bg-input)",
            inputSuccess: "var(--vf-bg-input)",
            disabled: "hsl(var(--secondary))",
            selected: "rgba(17,24,39,0.05)", // Option hover, cbgroup blocks selected
            passive: theme("colors.red.200"),
            icon: "var(--vf-gray-500)",
            danger: "var(--vf-danger-lighter)",
            success: "var(--vf-success-lighter)",
            addon: "transparent",
            tag: "var(--vf-primary)",
            sliderHandle: "var(--vf-primary)",
            toggleHandle: "#ffffff",
            dateHead: "var(--vf-gray-100)",
            btn: "var(--vf-primary)",
            btnDanger: "var(--vf-danger)",
            btnSecondary: "var(--vf-gray-200)",
        },

        textColors: {
            onPrimary: "#ffffff",
            input: "var(--vf-gray-800)",
            inputHover: "var(--vf-color-input)",
            inputFocus: theme("colors.gray.600"),
            inputDanger: "var(--vf-color-input)",
            inputSuccess: "var(--vf-color-input)",
            placeholder: "var(--vf-gray-300)",
            disabled: "var(--vf-gray-400)",
            passive: "var(--vf-gray-700)",
            muted: "var(--vf-gray-500)",
            floating: "var(--vf-color-muted)",
            floatingFocus: "var(--vf-color-floating)",
            floatingSuccess: "var(--vf-color-floating)",
            floatingDanger: "var(--vf-color-floating)",
            danger: "var(--vf-danger)",
            success: "var(--vf-success)",
            addon: "inherit",
            tag: "var(--vf-color-on-primary)",
            dateHead: "var(--vf-gray-700)",
            btn: "var(--vf-color-on-primary)",
            btnDanger: "#ffffff",
            btnSecondary: "var(--vf-gray-700)",
        },

        borderColors: {
            input: "var(--vf-gray-300)",
            inputFocus: "hsl(var(--primary))",
            inputHover: "var(--vf-border-color-input)",
            inputDanger: theme("colors.red.500"),
            inputSuccess: "var(--vf-border-color-input)",
            checked: "var(--vf-primary)", // applies to checkbox & radio
            btn: "var(--vf-primary)",
            tag: "var(--vf-primary)",
            sliderTooltip: "var(--vf-primary)",
            passive: "var(--vf-gray-300)",
            btnDanger: "var(--vf-danger)",
            btnSecondary: "var(--vf-gray-200)",
            blockquote: "var(--vf-gray-300)",
            hr: "var(--vf-gray-300)",
        },

        shadows: {
            input: theme("boxShadow.sm"),
            inputHover: "var(--vf-shadow-input)",
            inputFocus: "var(--vf-shadow-input)",
            handles: "0px 0px 0px 0px rgba(0,0,0,0)",
            handlesHover: "var(--vf-shadow-input-hover)",
            handlesFocus: "var(--vf-shadow-input-focus)",
            btn: "var(--vf-shadow-input)",
            dropdown: "var(--vf-shadow-input)",
        },

        checkboxSize: {
            base: theme("width")["4"],
            sm: theme("width")["3.5"],
            lg: theme("width")["4"],
        },

        gallerySize: {
            base: theme("width")["24"],
            sm: theme("width")["20"],
            lg: theme("width")["28"],
        },

        toggleWidth: {
            base: theme("width")["12"],
            sm: theme("width")["11"],
            lg: theme("width")["12"],
        },

        toggleHeight: {
            base: theme("height")["5"],
            sm: theme("height")["4"],
            lg: theme("height")["5"],
        },

        sliderHeight: {
            base: theme("height")["1.5"],
            sm: theme("height")["1.25"],
            lg: theme("height")["2"],
        },

        sliderHeightVertical: {
            base: theme("height")["80"],
            sm: "var(--vf-slider-height-vertical)",
            lg: "var(--vf-slider-height-vertical)",
        },

        sliderHandleSize: {
            base: theme("height")["4"],
            sm: theme("height")["3.5"],
            lg: theme("height")["5"],
        },

        sliderTooltipDistance: {
            base: theme("width")["2"],
            sm: theme("width")["1.5"],
            lg: theme("width")["2"],
        },

        sliderTooltipArrowSize: {
            base: theme("width")["1.25"],
            sm: "var(--vf-slider-tooltip-arrow-size)",
            lg: "var(--vf-slider-tooltip-arrow-size)",
        },
    }),

    plugins: [
        require("@vueform/vueform/tailwind"),
        require("tailwindcss-motion"),
    ],
};
