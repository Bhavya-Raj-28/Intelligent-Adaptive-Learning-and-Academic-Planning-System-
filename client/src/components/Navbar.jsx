function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6">
      <h1 className="text-2xl font-bold text-white">
        EduAI
      </h1>

      <div className="flex gap-8 text-gray-300">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">About</a>
        <a href="#">Login</a>
      </div>
    </nav>
  );
}

export default Navbar;