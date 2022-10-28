export const prepareToAnimate = (ref, preStyle = ' ') => {
    ref.current.className = preStyle
    void ref.current.offsetWidth
}

export function avatarFromString(name, size = null) {
    return {
        sx: {
          bgcolor: stringToColor(name),
          width: size ?? 42,
          height: size ?? 42,
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
      };
}


function stringToColor(string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }