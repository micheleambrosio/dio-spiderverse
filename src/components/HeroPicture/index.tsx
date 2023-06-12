import Image, { StaticImageData } from "next/image";
import ImageSpiderMan616 from "@public/spiders/spider-man-616.png";
import ImageSpiderMan1610 from "@public/spiders/spider-man-1610.png";
import ImageSpiderWoman65 from "@public/spiders/mulher-aranha-65.png";
import ImageSpDr14512 from "@public/spiders/sp-dr-14512.png";
import ImageSpiderHam8311 from "@public/spiders/spider-ham-8311.png";
import ImageSpiderMan928 from "@public/spiders/spider-man-928.png";
import ImageSpiderMan90214 from "@public/spiders/spider-man-90214.png";

import { IHeroData } from "@/interfaces/heroes";

const heroesImage: Record<string, StaticImageData> = {
  "spider-man-616": ImageSpiderMan616,
  "mulher-aranha-65": ImageSpiderWoman65,
  "spider-man-1610": ImageSpiderMan1610,
  "sp-dr-14512": ImageSpDr14512,
  "spider-ham-8311": ImageSpiderHam8311,
  "spider-man-90214": ImageSpiderMan90214,
  "spider-man-928": ImageSpiderMan928,
};

interface IProps {
  hero: IHeroData;
}

export default function HeroPicture({ hero }: IProps) {
  return (
    <Image
      src={heroesImage[hero.id] || ImageSpiderMan616}
      alt={`${hero.name} (Universo-${hero.universe})` || ""}
      priority
    />
  );
}
