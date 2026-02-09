import { Card, Spinner, Alert, Badge } from "react-bootstrap";

/*
  Este componente é responsável apenas por:
  - Exibir o resultado do indicador escolhido
  - Tratar loading, erro e ausência de dados
  - Formatar valores para leitura humana
  Nenhuma busca de API acontece aqui.
*/

/* ================= FORMATADORES ================= */

/*
  Converte valores monetários grandes (PIB) para um formato legível.
  Evita números gigantes na tela e melhora a experiência do usuário.
*/
function formatGDP(value) {
    if (value >= 1_000_000_000_000) {
        return `US$ ${(value / 1_000_000_000_000).toFixed(1)} trilhões`;
    }

    if (value >= 1_000_000_000) {
        return `US$ ${(value / 1_000_000_000).toFixed(1)} bilhões`;
    }

    if (value >= 1_000_000) {
        return `US$ ${(value / 1_000_000).toFixed(1)} milhões`;
    }

    if (value >= 1_000) {
        return `US$ ${(value / 1_000).toFixed(1)} mil`;
    }

    return `US$ ${value.toLocaleString("pt-BR")}`;
}

/*
  Formata dados populacionais para leitura clara,
  mantendo coerência visual com outros indicadores.
*/
function formatPopulation(value) {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)} bilhões de habitantes`;
    }

    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)} milhões de habitantes`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)} mil habitantes`;
    }

    return `${value.toLocaleString("pt-BR")} habitantes`;
}

/*
  Normaliza valores percentuais.
  Evita exibição de números irreais acima de 100%.
*/
function formatPercentage(value) {
    const percentage = Math.min(Math.round(value), 100);
    return `${percentage}%`;
}

/*
  Arredonda anos (expectativa de vida),
  priorizando clareza ao invés de precisão excessiva.
*/
function formatYears(value) {
    const years = Math.round(value);
    return `${years} anos`;
}

/* ================= CLASSIFICAÇÕES ================= */

/*
  Classificações visuais ajudam a interpretar o dado rapidamente,
  sem o usuário precisar conhecer o contexto técnico.
*/
function classifyLifeExpectancy(value) {
    if (value < 50) return { text: "Baixa", color: "danger" };
    if (value < 75) return { text: "Média", color: "warning" };
    return { text: "Alta", color: "success" };
}

function classifyPoverty(value) {
    if (value > 20) return { text: "Alta", color: "danger" };
    if (value >= 10) return { text: "Média", color: "warning" };
    return { text: "Baixa", color: "success" };
}

function classifyPopulation(value) {
    if (value < 10_000_000) return { text: "Pequena", color: "primary" };
    if (value < 100_000_000) return { text: "Média", color: "warning" };
    return { text: "Grande", color: "secondary" };
}

function classifyGDP(value) {
    if (value < 100_000_000_000) return { text: "Baixo", color: "danger" };
    if (value < 1_000_000_000_000) return { text: "Médio", color: "warning" };
    return { text: "Alto", color: "success" };
}

/* ================= COMPONENT ================= */

function IndicatorCard({ data, loading, error, countryName, indicator }) {

    /*
      Estados de interface:
      - loading → feedback visual
      - error → mensagem clara para o usuário
      - ausência de dados → não renderiza nada
    */

    if (loading) {
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" variant="secondary" />
                <p className="text-muted mt-2">Carregando dados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="light" className="mt-4 text-center">
                {error}
            </Alert>
        );
    }

    if (!data || data.value === null) return null;

    /* ================= LÓGICA DE FORMATAÇÃO ================= */

    let formattedValue = "";
    let classification = null;

    /*
      Cada indicador possui sua própria regra de formatação
      e classificação, mantendo o componente escalável.
    */
    if (indicator === "NY.GDP.MKTP.CD") {
        formattedValue = formatGDP(data.value);
        classification = classifyGDP(data.value);
    }

    if (indicator === "SP.POP.TOTL") {
        formattedValue = formatPopulation(data.value);
        classification = classifyPopulation(data.value);
    }

    if (indicator === "SI.POV.DDAY") {
        formattedValue = formatPercentage(data.value);
        classification = classifyPoverty(data.value);
    }

    if (indicator === "SP.DYN.LE00.IN") {
        formattedValue = formatYears(data.value);
        classification = classifyLifeExpectancy(data.value);
    }

    /* ================= RENDER FINAL ================= */

    return (
        <Card className="mt-4 shadow-sm border-0">
            <Card.Body className="text-center">

                {/* País selecionado */}
                <Badge bg="secondary" className="mb-2">
                    {countryName}
                </Badge>

                {/* Valor principal */}
                <h2 className="fw-bold text-dark mt-3">
                    {formattedValue}
                </h2>

                {/* Classificação visual */}
                {classification && (
                    <Badge bg={classification.color} className="mt-2">
                        {classification.text}
                    </Badge>
                )}

                {/* Ano de referência do dado */}
                <p className="text-muted mt-3 mb-0">
                    Ano: {data.year ?? data.date ?? "—"}
                </p>

            </Card.Body>
        </Card>
    );
}

export default IndicatorCard;
