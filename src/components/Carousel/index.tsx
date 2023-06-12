import HeroDetails from "../HeroDetails";

import styles from "./carousel.module.scss";

import { IHeroData } from "@/interfaces/heroes";

interface IProps {
  heroes: IHeroData[];
  activeId: string;
}

export default function Carousel({ heroes, activeId }: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        <div className={styles.wrapper}>
          Área reservada para as imagens dos heróis com o efeito de carrossel
          parallax
        </div>
      </div>
      <div className={styles.details}>
        <HeroDetails data={heroes[0]} />
      </div>
    </div>
  );
}
