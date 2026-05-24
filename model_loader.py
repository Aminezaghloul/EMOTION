import torch
import torch.nn as nn
from torchvision import models


def load_model(model_path="best_resnet18_stft.pth"):
    state = torch.load(model_path, map_location="cpu")

    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, 4)

    model.load_state_dict(state)
    model.eval()

    return model