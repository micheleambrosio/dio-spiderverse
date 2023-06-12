"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroDetails from "../HeroDetails";
import HeroPicture from "../HeroPicture";

import styles from "./carousel.module.scss";

import { IHeroData } from "@/interfaces/heroes";

enum enPosition {
  FRONT = 0,
  MIDDLE = 1,
  BACK = 2,
}

interface IProps {
  heroes: IHeroData[];
  activeId: string;
}

export default function Carousel({ heroes, activeId }: IProps) {
  // Controla os itens visíveis do carrossel
  const [visibleItems, setVisibleItems] = useState<IHeroData[] | null>(null);

  // Armazena o item ativo do carrossel
  const [activeIndex, setActiveIndex] = useState(
    heroes.findIndex((hero) => hero.id === activeId) - 1
  );

  // Armazena a posição inicial, no eixo x, da interação com o carrossel
  const [startInteractionPosition, setStartInteractionPosition] =
    useState<number>(0);

  // Som de transição
  const transitionAudio = useMemo(() => new Audio("/songs/transition.mp3"), []);

  // Voz de cada personagem
  const voicesAudio: Record<string, HTMLAudioElement> = useMemo(
    () => ({
      "spider-man-616": new Audio("/songs/spider-man-616.mp3"),
      "mulher-aranha-65": new Audio("/songs/mulher-aranha-65.mp3"),
      "spider-man-1610": new Audio("/songs/spider-man-1610.mp3"),
      "sp-dr-14512": new Audio("/songs/sp-dr-14512.mp3"),
      "spider-ham-8311": new Audio("/songs/spider-ham-8311.mp3"),
      "spider-man-90214": new Audio("/songs/spider-man-90214.mp3"),
      "spider-man-928": new Audio("/songs/spider-man-928.mp3"),
    }),
    []
  );

  // Altera o visibleItems sempre que o activeIndex é alterado
  useEffect(() => {
    // itens que serão mostrados ao longo do carrossel
    const items = [...heroes];

    // calcula o índice do array de acordo com o item ativo
    // de forma que o número nunca saia do escopo do array
    const indexInArrayScope =
      ((activeIndex % items.length) + items.length) % items.length;

    // itens que estão visíveis neste momento para o usuário
    // duplicamos o array para dar a impressão de um carrossel infinito (360deg)
    const visibleItems = [...items, ...items].slice(
      indexInArrayScope,
      indexInArrayScope + 3
    );

    setVisibleItems(visibleItems);
  }, [heroes, activeIndex]);

  // Altera o fundo da página de acordo com o herói selecionado
  useEffect(() => {
    const htmlEl = document.querySelector("html");

    if (!htmlEl || !visibleItems) {
      return;
    }

    const currentHeroId = visibleItems[1].id;
    htmlEl.style.backgroundImage = `url("/spiders/${currentHeroId}-background.png")`;
    htmlEl.classList.add("hero-page");

    // remove a classe quando o componente é desmontado
    return () => {
      htmlEl.classList.remove("hero-page");
    };
  }, [visibleItems]);

  // Reproduz efeitos sonoros ao rotacionar o carrossel
  useEffect(() => {
    if (!visibleItems) {
      return;
    }

    transitionAudio.play();
    const voiceAudio = voicesAudio[visibleItems[1].id];

    if (voiceAudio) {
      voiceAudio.volume = 0.3;
      voiceAudio?.play();
    }
  }, [visibleItems, transitionAudio, voicesAudio]);

  // Altera herói ativo no carrossel
  // +1 rotaciona no sentido horário
  // -1 rotaciona no sentido anti-horário
  const handleChangeActiveIndex = (newDirection: number) => {
    setActiveIndex((prevActiveIndex) => prevActiveIndex + newDirection);
  };

  // onDragStart (mouse): armazena a posição inicial da interação
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setStartInteractionPosition(e.clientX);
  };

  // onDragEnd (mouse): armazena a posição final da interação
  // Mexe o carrossel na direção que o usuário fez o evento de interação
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!startInteractionPosition) {
      return null;
    }

    const endInteractionPosition = e.clientX;
    const diffPosition = endInteractionPosition - startInteractionPosition;

    // diffPosition > 0 => direita para esquerda
    // diffPosition < 0 => esquerda para direita
    const newPosition = diffPosition > 0 ? -1 : 1;
    handleChangeActiveIndex(newPosition);
  };

  // onTouchStart (touch): armazena a posição inicial da interação
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartInteractionPosition(e.touches[0].clientX);
  };

  // onTouchEnd (touch): armazena a posição final da interação
  // Mexe o carrossel na direção que o usuário fez o evento de interação
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!startInteractionPosition) {
      return null;
    }

    const endInteractionPosition = e.changedTouches[0].clientX;

    // diffPosition > 0 => direita para esquerda
    // diffPosition < 0 => esquerda para direita
    const diffPosition = endInteractionPosition - startInteractionPosition;

    const newPosition = diffPosition > 0 ? -1 : 1;
    handleChangeActiveIndex(newPosition);
  };

  if (!visibleItems) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        <div
          className={styles.wrapper}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="popLayout">
            {visibleItems?.map((item, position) => (
              <motion.div
                key={item.id}
                className={styles.hero}
                transition={{ duration: 0.8 }}
                initial={{
                  x: -1500,
                  scale: 0.75,
                }}
                animate={{ x: 0, ...getItemStyles(position) }}
                exit={{
                  x: 0,
                  left: "-20%",
                  opacity: 0,
                  scale: 1,
                }}
              >
                <HeroPicture hero={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <motion.div
        className={styles.details}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <HeroDetails data={visibleItems[enPosition.MIDDLE]} />
      </motion.div>
    </div>
  );
}

// Estilos para o item que está visível na animação
// Dependendo da posição do herói no carrossel
const getItemStyles = (position: enPosition) => {
  if (position === enPosition.FRONT) {
    return {
      filter: "blur(10px)",
      scale: 1.2,
      zIndex: 3,
    };
  }

  if (position === enPosition.MIDDLE) {
    return {
      left: 300,
      scale: 0.8,
      top: "-10%",
      zIndex: 2,
    };
  }

  return {
    filter: "blur(10px)",
    scale: 0.6,
    left: 160,
    opacity: 0.8,
    zIndex: 1,
    top: "-20%",
  };
};
