import { useState } from "react";
import { Form, ListGroup, Button, Card, Badge } from "react-bootstrap";

/*
  Componente responsável por:
  - Seleção do país
  - Seleção do ano
  - Seleção do tipo de indicador
  Toda a lógica de escolha fica aqui, enquanto a busca de dados
  acontece no App.jsx
*/

function CountrySelect({
    countries = [],
    country,
    setCountry,
    selectedIndicator,
    setSelectedIndicator,
    year,
    setYear
}) {

    /* ================= ESTADOS LOCAIS ================= */


    // Texto digitado no campo de busca de países
    const [search, setSearch] = useState("");

    // Controla se a lista completa de países será exibida
    const [showAll, setShowAll] = useState(false);


    // Filtra países válidos e aplica busca por nome
    const filteredCountries = countries.filter(
        (c) =>
            c.region?.id !== "NA" &&
            c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Limita a exibição inicial para melhorar a usabilidade
    const visibleCountries = showAll
        ? filteredCountries
        : filteredCountries.slice(0, 10);


    return (
        <Card className="p-4 shadow-sm border-0">

            {/* Título com contador de países filtrados */}
            <h5 className="mb-3 text-secondary">
                Seleção de país
                <Badge bg="light" text="dark" className="ms-2">
                    {filteredCountries.length}
                </Badge>
            </h5>

            {/* Campo de busca por país */}
            <Form.Control
                type="text"
                placeholder="Buscar país..."
                className="mb-3"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    // Sempre que muda a busca, volta para lista reduzida
                    setShowAll(false);
                }}
            />

            {/* Lista de países filtrados */}
            {search && (
                <ListGroup
                    variant="flush"
                    style={{ maxHeight: "220px", overflowY: "auto" }}
                    className="mb-2"
                >
                    {visibleCountries.map((c) => (
                        <ListGroup.Item
                            key={c.id}
                            action
                            active={c.id === country}
                            onClick={() => {
                                // Define o país selecionado
                                setCountry(c.id);
                                setSearch(c.name);
                                setShowAll(false);
                            }}
                        >
                            {c.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {/* Botão para exibir todos os países filtrados */}
            {filteredCountries.length > 10 && !showAll && (
                <div className="text-center">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowAll(true)}
                    >
                        Ver todos
                    </Button>
                </div>
            )}

            {/* ================= SELEÇÃO DE ANO ================= */}

            <div className="mt-4">
                <h6>Escolha o ano:</h6>

                {/* Input numérico simples, direto e controlado */}
                <Form.Control
                    type="number"
                    min="1960"
                    max="2026"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    placeholder="Ano"
                    className="year-input mt-2"
                    style={{
                        maxWidth: "120px",
                        borderRadius: "50px",
                        textAlign: "center",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.9rem"
                    }}
                />
            </div>

            {/* ================= SELETOR DE INDICADOR ================= */}

            <Form.Select
                className="mt-3"
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
            >
                {/* Indicadores da API do Banco Mundial e Taxa de Câmbio */}
                <option value="SP.DYN.LE00.IN">Expectativa de vida</option>
                <option value="SP.POP.TOTL">População</option>
                <option value="SI.POV.DDAY">Taxa de pobreza</option>
                <option value="NY.GDP.MKTP.CD">PIB</option>
                <option value="EXCHANGE_RATE">Taxa de câmbio</option>
            </Form.Select>

        </Card>
    );
}

export default CountrySelect;
