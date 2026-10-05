const dados = {
  estoque: [
    { codigoProduto: 101, descricaoProduto: 'Caneta Azul', estoque: 150 },
    { codigoProduto: 102, descricaoProduto: 'Caderno Universitario', estoque: 75 },
    { codigoProduto: 103, descricaoProduto: 'Borracha Branca', estoque: 200 },
    { codigoProduto: 104, descricaoProduto: 'Lapis Preto HB', estoque: 320 },
    { codigoProduto: 105, descricaoProduto: 'Marcador de Texto Amarelo', estoque: 90 },
  ],
};

class ControleEstoque {
  constructor(produtos) {
    this.produtos = produtos.map(produto => ({ ...produto }));
    this.movimentacoes = [];
    this.proximoId = 1;
  }

  movimentar(codigoProduto, tipo, quantidade, descricao) {
    const produto = this.produtos.find(item => item.codigoProduto === codigoProduto);
    if (!produto) throw new Error('Produto nao encontrado.');
    if (!['entrada', 'saida'].includes(tipo)) {
      throw new Error('O tipo deve ser entrada ou saida.');
    }
    if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
      throw new Error('Informe uma quantidade inteira positiva.');
    }
    if (typeof descricao !== 'string' || !descricao.trim()) {
      throw new Error('Informe uma descricao para a movimentacao.');
    }
    if (tipo === 'saida' && quantidade > produto.estoque) {
      throw new Error(`Estoque insuficiente. Disponivel: ${produto.estoque}.`);
    }

    const estoqueAnterior = produto.estoque;
    const estoqueFinal = estoqueAnterior + (tipo === 'entrada' ? quantidade : -quantidade);
    if (!Number.isSafeInteger(estoqueFinal)) {
      throw new Error('O saldo ultrapassa o limite numerico permitido.');
    }
    const movimentacao = {
      id: this.proximoId++,
      codigoProduto,
      descricaoProduto: produto.descricaoProduto,
      tipo,
      descricao: descricao.trim(),
      quantidade,
      estoqueAnterior,
      estoqueFinal,
      data: new Date().toISOString(),
    };
    produto.estoque = estoqueFinal;
    this.movimentacoes.push(movimentacao);
    return { ...movimentacao };
  }
}

async function executar() {
  const readline = require('node:readline/promises');
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  const controle = new ControleEstoque(dados.estoque);
  console.log('CONTROLE DE ESTOQUE\nOs dados são mantidos enquanto o programa estiver aberto.');
  try {
    while (true) {
      console.log('\n1 - Consultar estoque\n2 - Entrada\n3 - Saida\n4 - Histórico\n0 - Encerrar');
      const opcao = (await terminal.question('Escolha uma opcao: ')).trim();
      if (opcao === '0') break;
      if (opcao === '1') {
        console.table(controle.produtos);
      } else if (opcao === '4') {
        console.table(controle.movimentacoes);
      } else if (opcao === '2' || opcao === '3') {
        console.table(controle.produtos);
        const codigo = Number(await terminal.question('Codigo do produto: '));
        const quantidade = Number(await terminal.question('Quantidade: '));
        const descricao = await terminal.question('Descricao (ex.: compra ou venda): ');
        try {
          const movimento = controle.movimentar(codigo, opcao === '2' ? 'entrada' : 'saida', quantidade, descricao);
          console.log(`\nMovimentacao n ${movimento.id}: ${movimento.descricao}`);
          console.log(`Produto: ${movimento.descricaoProduto}`);
          console.log(`Estoque final: ${movimento.estoqueFinal} unidades.`);
        } catch (erro) {
          console.log(`Erro: ${erro.message}`);
        }
      } else {
        console.log('Opcao invalida.');
      }
    }
  } finally {
    terminal.close();
  }
}

module.exports = { ControleEstoque, dados };
if (require.main === module) {
  executar().catch(erro => {
    console.error(`Programa encerrado: ${erro.message}`);
    process.exitCode = 1;
  });
}
