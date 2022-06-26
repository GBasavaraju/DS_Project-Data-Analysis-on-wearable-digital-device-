export function switch_to_lighttheme() {
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = 'cupcake'
}

export function switch_to_darktheme() {
    document.documentElement.classList.add('dark')
    document.documentElement.dataset.theme = 'dark'
}