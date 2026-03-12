"use client";


export function Header() {
  return (
    <header className="absolute top-0 w-full z-50 bg-transparent">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo placeholder - text for now */}
          <h1 className="text-2xl font-playfair font-bold tracking-tighter text-accent drop-shadow-md">
            TALAV
            <span className="font-light text-white ml-2 drop-shadow-md">RESORT</span>
          </h1>
        </div>

      </div>
    </header>
  );
}
