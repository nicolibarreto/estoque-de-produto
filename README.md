# Controle de estoque em JavaScript

Com o Node.js 18 ou superior instalado, abra o terminal nesta pasta e execute:

```sh
node estoque.js
```

Use o menu para consultar os cinco produtos, registrar entradas ou saídas e consultar o histórico. Cada movimentação recebe um número sequencial único durante a execução, descrição, tipo, quantidade, data e saldos anterior e final. Após cada lançamento, o programa mostra o estoque final do produto.

Quantidades devem ser inteiras e positivas. Saídas superiores ao saldo disponível são rejeitadas sem alterar o estoque.

Os dados ficam na memória: ao fechar e reabrir o programa, os saldos retornam aos valores do JSON e a numeração reinicia.

Também é possível usar a classe em outro arquivo JavaScript:

```js
const { ControleEstoque, dados } = require('./estoque');
const controle = new ControleEstoque(dados.estoque);
const resultado = controle.movimentar(101, 'entrada', 20, 'Compra do fornecedor');
console.log(resultado.id); // 1
console.log(resultado.estoqueFinal); // 170
```
