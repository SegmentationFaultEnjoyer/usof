export const prepareToAnimate = (ref, preStyle = ' ') => {
    ref.current.className = preStyle
    void ref.current.offsetWidth
}
