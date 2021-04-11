import torch
import torch.nn as nn
import torch.nn.functional as F

# Code form right above https://huggingface.co/transformers/model_doc/bert.html#bertforpretraining
from transformers import BertTokenizer, BertModel
import torch

class Net(nn.Module):
  
  def initialize_BERT(self):
    self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    BERT_model = BertModel.from_pretrained('bert-base-uncased', output_hidden_states=True)
    BERT_model = BERT_model.to(self.device)
    BERT_model.eval()
    print("BERT_model loaded!")
    self.BERT_model_dict = {"model": BERT_model} # To avoid being part of the model params

  def __init__(self, device):
    super(Net, self).__init__()
    self.device = device
    self.initialize_BERT()
    self.emb = self.get_BERT_embedding
    layer_sizes = [768, 384, 48, 1]
    self.fc1 = nn.Linear(layer_sizes[0], layer_sizes[1])
    self.fc2 = nn.Linear(layer_sizes[1], layer_sizes[2])
    self.fc3 = nn.Linear(layer_sizes[2], layer_sizes[3])
  
  def forward(self, x):
    x = self.emb(x)#.unsqueeze(0)
    # print("Embedding tensor shape:", x.shape)
    x = self.fc1(x)
    print("after fc1:", x.shape)
    x = F.relu(x)
    x = F.relu(self.fc2(x))
    x = self.fc3(x)
    # x = torch.sigmoid(x)
    # print(x)
    # x = torch.argmax(x, dim=1)
    x = x.squeeze(dim=1)
    # print('x at end of forward:', type(x), x.size(), x)
    x = x.to(self.device)
    return x

  # Thank You: https://github.com/BramVanroy/bert-for-inference/blob/master/introduction-to-bert.ipynb
  def get_BERT_embedding(self, texts):
    # print("Texts:", texts)
    if type(texts) != list:
      texts = [texts]
    cls_embeddings = []
    for text in texts:
      text_ids = self.tokenizer.encode(text, return_tensors='pt')
      text_ids = text_ids.to(self.device)
      # print(text_ids.size())

      # print(type(text_ids))
      with torch.no_grad():
          out = self.BERT_model_dict['model'](input_ids=text_ids)

      hidden_states = out[2]
      embedding_tensor = hidden_states[2]
      cls_embedding = embedding_tensor[0][0]
      cls_embeddings.append(cls_embedding.flatten())
    # print(f'cls_embeddings {cls_embeddings}')
    return torch.stack(cls_embeddings)# cls_embedding.flatten()

class ModelInitializer():
    def __init__(self, model_path):
        self.model_path = model_path
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Device: {self.device}")
        self.net = None
        self.initialize_model()
    
    def initialize_model(self):
        if self.net is None:
            # Testing our network is looking fine
            self.net = Net(self.device)
            self.net.load_state_dict(torch.load(self.model_path, map_location=self.device))
            self.net.to(self.device)
            print('Net initialized!\n', self.net)
            # out = self.net(['hello there', "what's your name?"])
            # print(out, out.size())

    def score(self, texts):
        '''Scores the texts and returns the score'''
        return self.net(texts).tolist()