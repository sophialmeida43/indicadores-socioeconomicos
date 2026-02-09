import { Card, Spinner, Alert, Badge } from "react-bootstrap";

// Componente só mostra a cotação, não faz fetch nem lógica pesada
function ExchangeRateCard({ rate, currency, loading, error }) {

    return (
        <Card className="mt-4 shadow-sm border-0">
            <Card.Body className="text-center">

                {/* Título do card */}
                <Badge bg="primary" className="mb-2">
                    Taxa de Câmbio
                </Badge>

                {/* Mostra loading quando a API ainda tá carregando */}
                {loading && (
                    <>
                        <Spinner animation="border" size="sm" />
                        <p className="text-muted mt-2">Carregando câmbio...</p>
                    </>
                )}

                {/* Mostra o erro se deu ruim */}
                {!loading && error && (
                    <Alert variant="light" className="mt-3">
                        {error}
                    </Alert>
                )}

                {/* Mostra o valor da cotação só se tiver valor e moeda */}
                {!loading && rate != null && currency && (
                    <>
                        <h4 className="fw-bold mt-3">
                            1 {currency} = {rate.toFixed(2)} BRL
                        </h4>
                        <p className="text-muted mb-0">
                            Cotação atual (referência de mercado)
                        </p>
                    </>
                )}

            </Card.Body>
        </Card>
    );
}

export default ExchangeRateCard;
