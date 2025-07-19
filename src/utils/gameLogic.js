const generateRandomNumber = () => {
  return Math.floor(Math.random() * 101); // 0 à 100 inclus
};

const determineGameResult = (number) => {
  return number > 70 ? 'gagné' : 'perdu';
};

const calculateBalanceChange = (result) => {
  return result === 'gagné' ? 50 : -35;
};

const playGame = () => {
  const generatedNumber = generateRandomNumber();
  const result = determineGameResult(generatedNumber);
  const balanceChange = calculateBalanceChange(result);
  
  return {
    generatedNumber,
    result,
    balanceChange
  };
};

module.exports = {
  generateRandomNumber,
  determineGameResult,
  calculateBalanceChange,
  playGame
};
