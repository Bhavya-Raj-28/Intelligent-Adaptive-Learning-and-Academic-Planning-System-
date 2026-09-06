function Button({ text, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        rounded-full
        bg-gradient-to-r
        from-blue-600
        via-cyan-500
        to-emerald-400
        px-7
        py-3
        font-semibold
        text-white
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-lg
        active:translate-y-0
      "
    >
      {text}
    </button>
  );
}

export default Button;