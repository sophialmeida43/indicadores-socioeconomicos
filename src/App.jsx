import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";

// Componentes responsáveis pela interface
import CountrySelect from "./components/CountrySelect";
import IndicatorCard from "./components/IndicatorCard";
import ExchangeRateCard from "./components/ExchangeRateCard";

// Mapeamento entre país (World Bank) e moeda (API de câmbio)
import { countryCurrencyMap } from "./utils/countryCurrencyMap";

function App() {

  const EXCHANGE_API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;


  /* ================= ESTADOS PRINCIPAIS ================= */

  // País selecionado (código padrão da API do Banco Mundial)
  const [country, setCountry] = useState("BR");

  // Indicador que será buscado na API
  // indicator → usado efetivamente na requisição
  // selectedIndicator → usado apenas na seleção do usuário
  const [indicator, setIndicator] = useState("SP.DYN.LE00.IN");
  const [selectedIndicator, setSelectedIndicator] = useState("SP.DYN.LE00.IN");

  // Ano selecionado para a busca dos dados
  const [year, setYear] = useState(2000);

  // Lista completa de países retornada pela API do Banco Mundial
  const [countries, setCountries] = useState([]);

  // Dados retornados das APIs
  const [data, setData] = useState(null);
  const [exchangeData, setExchangeData] = useState(null);

  // Estados de controle de interface
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Controle explícito de qual card será exibido
  // Evita renderizações indevidas e melhora a legibilidade do fluxo
  const [view, setView] = useState("INDICATOR");


  // Busca a lista de países apenas uma vez ao carregar a aplicação
  // A lista é reutilizada em todo o projeto
  useEffect(() => {
    fetch("https://api.worldbank.org/v2/country?format=json&per_page=300")
      .then(res => res.json())
      .then(result => {
        if (result[1]) setCountries(result[1]);
      });
  }, []);

  /* ================= BUSCA DE INDICADORES ================= */

  // Responsável por buscar indicadores sociais e econômicos
  // diretamente da API do Banco Mundial
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?date=${year}&format=json`
      );

      const result = await response.json();

      // Caso o indicador não tenha dados disponíveis
      if (!result[1] || result[1].length === 0) {
        setError("Este indicador não possui dados disponíveis.");
      } else {
        // A API retorna um array, então utilizo o primeiro valor válido
        setData(result[1][0]);
      }
    } catch {
      setError("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BUSCA DE TAXA DE CÂMBIO ================= */

  // Busca taxa de câmbio usando uma API externa
  // Separada da lógica do Banco Mundial para manter responsabilidade única
  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    setExchangeData(null);

    // Limitação comum em APIs gratuitas de câmbio
    if (year < 2000) {
      setError("Dados de taxa de câmbio não disponíveis para este ano.");
      setLoading(false);
      return;
    }

    try {
      // Converte o país selecionado na sua respectiva moeda
      const currency = countryCurrencyMap[country];

      if (!currency) {
        setError("Moeda não encontrada para este país.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${currency}`
      );

      const result = await response.json();

      // Armazena apenas as informações necessárias para o card
      setExchangeData({
        rate: result.conversion_rates.BRL,
        currency,
        year
      });

    } catch {
      setError("Erro ao buscar taxa de câmbio.");
    } finally {
      setLoading(false);
    }
  };

  // Obtém o nome completo do país para exibição
  const selectedCountry = countries.find(c => c.id === country);

  /* ================= RENDERIZAÇÃO ================= */

  return (
    <Container className="mt-5">

      <h1 className="text-center mb-3">
        Indicadores Sociais e Econômicos
      </h1>

      <p className="text-center mb-3">
        Análise de indicadores sociais, econômicos e taxas de câmbio por país
      </p>

      {/* Componente responsável pela seleção de país, ano e indicador */}
      <CountrySelect
        countries={countries}
        country={country}
        setCountry={setCountry}
        selectedIndicator={selectedIndicator}
        setSelectedIndicator={setSelectedIndicator}
        year={year}
        setYear={setYear}
      />

      <div className="text-center mt-3">
        <Button
          onClick={() => {
            // Decide qual tipo de dado será buscado
            if (selectedIndicator === "EXCHANGE_RATE") {
              setView("EXCHANGE");
              fetchExchangeRate();
            } else {
              setView("INDICATOR");
              setIndicator(selectedIndicator);
              fetchData();
            }
          }}
        >
          Buscar dados
        </Button>
      </div>

      {/* Card específico para taxa de câmbio */}
      {view === "EXCHANGE" && (
        <ExchangeRateCard
          rate={exchangeData?.rate}
          currency={exchangeData?.currency}
          loading={loading}
          error={error}
        />
      )}

      {/* Card genérico para indicadores sociais e econômicos */}
      {view === "INDICATOR" && (
        <IndicatorCard
          data={data}
          loading={loading}
          error={error}
          countryName={selectedCountry?.name}
          indicator={indicator}
        />
      )}

    </Container>
  );
}

export default App;
