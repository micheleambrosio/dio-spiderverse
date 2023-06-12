import Link from "next/link";

import HeroPicture from "../HeroPicture";

import styles from "./heroesList.module.scss";

import { spidermanFont } from "@/fonts";
import { IHeroData } from "@/interfaces/heroes";

interface IProps {
  heroes: IHeroData[];
}

export default function HeroesList({ heroes }: IProps) {
  return (
    <>
      <h1 className={`${spidermanFont.className} ${styles.title}`}>
        Personagens
      </h1>
      <section className={styles.heroes}>
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className={`${styles.imageContainer} ${styles[hero.id]}`}
          >
            <Link href={`/hero/${hero.id}`}>
              <HeroPicture hero={hero} />
            </Link>
          </div>
        ))}
      </section>
    </>
  );
}
