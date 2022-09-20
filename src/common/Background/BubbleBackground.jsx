import './style.scss'

export function AnimatedBackground(props) {
    return (
        <div className="bubbles">
            {props.children}
            {new Array(50).fill('').map((_, i) => <div className='bubble' key={i}></div>)}
        </div>
    )
}