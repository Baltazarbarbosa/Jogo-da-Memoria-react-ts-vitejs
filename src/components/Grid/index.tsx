import './styles.css'
import { Card, CardProps } from "../Card";
import { duplicateRegenerateSortArray } from '../../utils/card-utils';
import { useRef, useState } from 'react';

export interface GridProps {
    cards: CardProps[]
}

export function Grid({ cards }: GridProps) {

    const [stateCards, setStateCards] = useState(() => {
        return duplicateRegenerateSortArray(cards)
    });

    const first = useRef<CardProps | null>(null);
    const second = useRef<CardProps | null>(null);
    const unflip = useRef(false);
    const [matches, setMatches] = useState(0);
    const [moves, setMoves] = useState(0);

    const handleReset = () => {
        setStateCards(duplicateRegenerateSortArray(cards));
        first.current = null;
        second.current = null;
        unflip.current = false;
        setMatches(0);
        setMoves(0);
    }


    const handleClick = (id: string) => {
        const newStateCards = stateCards.map((card) => {
            // Se o id do cartao nao for o id clicado, nao faz nada
            if (card.id != id) return card;
            // Se o cartao estiver virado, não faz nada
            if (card.flipped) return card;

            //Desviro possiveis cartas erradas
            if (unflip.current && first.current && second.current) {
                //A pessoa errou
                first.current.flipped = false;
                second.current.flipped = false;
                first.current = null;
                second.current = null;
                unflip.current = false;
            }

            // viraro card
            card.flipped = true;

            //Configura primeira e segunda carta clicada
            if (first.current == null) {
                first.current = card;
            } else if (second.current == null) {
                second.current = card;
            }

            //Dois cartões virados
            //Checagem s estão corretos
            if (first.current && second.current) {
                if (first.current.back == second.current.back) {
                    //Acertou
                    first.current = null;
                    second.current = null;
                    setMatches((m) => m + 1);
                } else {
                    unflip.current = true;
                }
                setMoves((m) => m + 1);
            }


            return card
        });

        setStateCards(newStateCards);
    };

    return (
        <>
            <div className="text">
                <h1>Jogo da memória</h1>
                <p>Movimentos:{moves} | Acertos: {matches} | <button onClick={() => handleReset()}>Reset</button></p>
            </div>
            <div className="grid">
                {stateCards.map((card) => {
                    return <Card {...card} key={card.id} handleClick={handleClick} />;
                })
                }
            </div>
        </>
    );
}