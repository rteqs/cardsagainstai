var torchjs = require('@arition/torch-js');

bert_model_path = './resources/models/traced_mobilebert_net_wrapper.pt'

var bert_script_module = new torchjs.ScriptModule(bert_model_path);

async function score(text) {
  // Step 1: Get tokenized text tensor
  console.log(`Converting "${text}" to tokens tensor...`)
  var tokens_array = await text_to_tokens(text)
  console.log(`Tokens tensor (array): [${tokens_array}]`)
  var bert_tokens_tensor = torchjs.tensor([tokens_array])
  // console.log(bert_tokens_tensor.toObject())

  // Step 2: Pass tokenized text tensor through BERT model
  console.log('About to run tokens tensor through BERT model to get embedding...')
  let bert_embedding_tensor = await tokens_to_embs(bert_tokens_tensor)
  console.log(`Embedding tensor (array): [${bert_embedding_tensor.slice(0, 6)}, ...]`)

  // TODO: Implement Step 3
  // Step 3: BERT embedding through classifer to get score
  console.log('About to run embeddings tensor through classifier model to get score...')
  let score = await emb_to_score(bert_embedding_tensor)
  console.log(`Score for "${text}" is \nScore:${score}`);
  return score
}

async function emb_to_score(bert_embedding_tensor) {
  // TODO
  return -1
}

async function tokens_to_embs(bert_tokens_tensor) {
  let output = await bert_script_module.forward(bert_tokens_tensor)
  // let output = await script_module.forward(torchjs.tensor([[0, 0, 0, 0, 0]], {
  //   dtype: torchjs.Long,
  // }), torchjs.tensor([[0, 0, 0, 0, 0]], {
  //   dtype: torchjs.long,
  // }))
  // console.log(output[0].toObject(), output[1])
  embedding = output[0].toObject()['data']
  // console.log(embedding)
  return embedding
}


const tokenizers = require('tokenizers')
// import {BertWordPieceTokenizer} from "tokenizers";
async function text_to_tokens(text) {
  // Got vocab file from https://github.com/microsoft/SDNet/blob/master/bert_vocab_files/bert-base-uncased-vocab.txt
  const wordPieceTokenizer = await tokenizers.BertWordPieceTokenizer.fromOptions({ vocabFile: "./resources/models/bert-base-uncased-vocab.txt" });
  const wpEncoded = await wordPieceTokenizer.encode(text);
  
  // console.log(wpEncoded.length);
  // console.log(typeof wpEncoded.tokens);
  // console.log(wpEncoded.ids);
  // console.log(wpEncoded.attentionMask);
  // console.log(wpEncoded.offsets);
  // console.log(wpEncoded.overflowing);
  // console.log(wpEncoded.specialTokensMask);
  // console.log(wpEncoded.typeIds);
  // console.log(wpEncoded.wordIndexes);
  return wpEncoded.ids
}

module.exports = {
    score
};  