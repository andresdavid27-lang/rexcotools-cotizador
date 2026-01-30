import { QuoteBuilder } from "@/components/QuoteBuilder";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
      {/* Simple Navbar */}
      <header className="bg-rexco-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-48 h-10">
              <Image
                src="/logo.jpg"
                alt="Rexcotools"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <div className="text-sm text-slate-400">
            v0.1.0 MVP
          </div>
        </div>
      </header>

      <QuoteBuilder />
    </main>
  );
}
