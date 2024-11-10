import React, { useState, useEffect } from 'react';
import styles from '../css/CurrencyConverter.module.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar a taxa de câmbio
  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/bed362a3aed016f9eec30946/latest/${fromCurrency}`);
      const data = await response.json();

      if (data.result === 'success') {
        setExchangeRates(data.conversion_rates);
      } else {
        setError('Erro ao buscar taxas de câmbio');
      }
    } catch (error) {
      setError('Erro ao conectar com a API');
    } finally {
      setLoading(false);
    }
  };

  // Realiza a conversão com base nas taxas de câmbio
  const handleConvert = () => {
    if (!exchangeRates[toCurrency]) {
      return;
    }
    const result = (amount * exchangeRates[toCurrency]).toFixed(2);
    setConvertedAmount(result);
  };

  // Chama a função de busca de taxas quando o 'fromCurrency' mudar
  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency]);

  // Chama a conversão toda vez que o 'amount', 'fromCurrency' ou 'toCurrency' mudarem
  useEffect(() => {
    if (exchangeRates[toCurrency]) {
      handleConvert();
    }
  }, [amount, toCurrency, exchangeRates]);

  return (
    <div className={styles.container}>
      <h2>Conversor de Moedas</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        disabled={loading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="BRL">BRL</option>
      </select>
      <span> para </span>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        disabled={loading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="BRL">BRL</option>
      </select>
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Carregando...' : 'Converter'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.result}>Resultado: {convertedAmount} {toCurrency}</p>
    </div>
  );
};

export default CurrencyConverter;