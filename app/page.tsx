import { Link } from "lib/transition"

import { PageRoutes } from "@/lib/pageroutes"
import { buttonVariants } from "@/components/ui/button"
import { TextAnimate } from "@/components/ui/text-animate"

export default function Home() {
  return (
    <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      
      <TextAnimate animation="scaleUp" by="text" className="mb-4 text-4xl font-bold sm:text-6xl">
        Valide seu Payload a55 / Microcash
      </TextAnimate>
      <p className="mb-8 max-w-[1000px] text-1xl  sm:text-2xl">
        Ferramenta criada para validar os payloads de pix na microcash e a55  
      </p>
      
      
      <div className="flex items-center gap-5">
        <Link
          href={`/docs${PageRoutes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Acessar validador
        </Link>
      </div>
    </section>
  )
}
