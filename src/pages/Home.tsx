import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonText,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon
} from "@ionic/react";

import { swapVerticalOutline, imageOutline } from "ionicons/icons";

import { useEffect, useState } from "react";
import "./Home.css";

interface Character {
  id: number;
  name: string;
  gender: string;
  status: string;
  image: string | null;
}

const Home: React.FC = () => {

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchCharacters = async (direction: "asc" | "desc") => {
    try {

      setLoading(true);
      setError(null);

      const url =
        `https://futuramaapi.com/api/characters?orderBy=id&orderByDirection=${direction}&page=1&size=50`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setCharacters(data.items);

    } catch {

      setError("No se pudieron cargar los personajes");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchCharacters(order);

  }, [order]);

  const toggleOrder = () => {

    setOrder(prev => prev === "asc" ? "desc" : "asc");

  };

  const getStatusClass = (status: string) => {

    if (status === "ALIVE") return "status-alive";
    if (status === "DEAD") return "status-dead";
    return "status-unknown";

  };

  return (
    <IonPage id="home-page">

      <IonHeader>
        <IonToolbar>

          <IonTitle>Personajes de Futurama</IonTitle>

          <IonButton
            slot="end"
            fill="clear"
            onClick={toggleOrder}
          >
            <IonIcon icon={swapVerticalOutline} />
            {order.toUpperCase()}
          </IonButton>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        {loading && (
          <div className="center">
            <IonSpinner name="crescent" />
            <p>Cargando...</p>
          </div>
        )}

        {error && (
          <div className="center">
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          </div>
        )}

        {!loading && !error && characters.length === 0 && (
          <div className="center">
            <p>No hay datos</p>
          </div>
        )}

        {!loading && !error && characters.length > 0 && (

          <IonList className="card-list">

            {characters.map((character) => (

              <IonCard key={character.id} className="character-card">

                <IonCardContent>

                  <div className="card-container">

                    <div className="card-image">

                      {character.image ? (

                        <img
                          src={character.image}
                          alt={character.name}
                        />

                      ) : (

                        <div className="no-image">
                          <IonIcon icon={imageOutline} />
                        </div>

                      )}

                    </div>

                    <div className="card-info">

                      <h2>{character.name}</h2>

                      <p>Género: {character.gender}</p>

                      <p>
                        Estado:{" "}
                        <span className={getStatusClass(character.status)}>
                          {character.status}
                        </span>
                      </p>

                    </div>

                    <div className="card-number">
                      #{character.id}
                    </div>

                  </div>

                </IonCardContent>

              </IonCard>

            ))}

          </IonList>

        )}

      </IonContent>

    </IonPage>
  );
};

export default Home;
