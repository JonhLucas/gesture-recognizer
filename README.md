# ✋ Gesture Recognizer

Sistema de reconhecimento de gestos em tempo real utilizando visão computacional.  
O projeto captura dados da webcam, detecta a mão do usuário e classifica gestos, permitindo interação natural com aplicações.

---

## 📸 Demonstração

> <img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/6f21e4c9-6072-4abe-b686-a63b05d29aa9" />


[demo](https://codepen.io/editor/Jonh-Lucas-Alves-da-Silva/pen/019db6ca-9bfd-772b-91f6-22f7f1447af5)

---

## 🚀 Funcionalidades

- Detecção de mãos em tempo real
- Reconhecimento de gestos pré-definidos
- Extração de landmarks (pontos da mão)
- Exibição do gesto identificado na tela
- Estrutura modular para adicionar novos gestos
- Processamento em tempo real via webcam

Projetos desse tipo normalmente utilizam modelos que detectam **21 pontos-chave da mão**, permitindo identificar posições e movimentos com precisão :contentReference[oaicite:0]{index=0}.

---

## 🛠️ Tecnologias utilizadas

- JavaScript
- MediaPipe 
- A-Frame *(se aplicável)*

---
## ▶️ Uso
Permita acesso à webcam
Posicione a mão na frente da câmera
Execute gestos reconhecidos pelo sistema
O nome do gesto será exibido na tela

✋ Gestos suportados

Exemplo (ajuste conforme seu projeto):

✊ Punho fechado
✋ Palma aberta
👍 Positivo
☝️ Apontando

## Como funciona
  - Captura de vídeo via webcam
  - Detecção da mão
  - Extração de landmarks (21 pontos)
  - Cálculo de ângulos/distâncias
  - Classificação do gesto
  - Exibição do resultado
## Possíveis melhorias
  - Adicionar novos gestos personalizados
  - Treinar um modelo próprio
  - Integrar com aplicações (jogos, VR, IoT)
  - Melhorar performance e estabilidade
  - Reconhecimento de gestos contínuos (movimento)

