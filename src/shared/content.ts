// Content structure for Luquinhas app

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
}

export interface StoryPage {
  image: string;
  text: string;
  audioUrl?: string;
}

export interface Curiosity {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  link: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

export const stories: Story[] = [
  {
    id: 'story-1',
    title: 'O Mosquito da Dengue',
    pages: [
      {
        image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=800',
        text: 'Era uma vez um pequeno mosquito chamado Zé, que vivia perto de uma casa muito bonita.',
      },
      {
        image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
        text: 'Um dia, Zé descobriu que seus piquinhos podiam deixar as pessoas doentes. Ele ficou muito triste!',
      },
      {
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        text: 'As crianças aprenderam a eliminar água parada e Zé não teve mais onde nascer. Foi assim que todos ficaram saudáveis!',
      }
    ]
  }
];

export const curiosities: Curiosity[] = [
  {
    id: 'curiosity-1',
    title: 'O Mosquito Aedes',
    description: 'O mosquito da dengue é pequeno, tem listras brancas e pretas, e gosta de picar durante o dia!',
    image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=600',
    icon: 'bug'
  },
  {
    id: 'curiosity-2',
    title: 'Como Prevenir',
    description: 'Não deixe água parada em vasos, pneus ou garrafas. O mosquito coloca seus ovos na água!',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600',
    icon: 'droplet'
  },
  {
    id: 'curiosity-3',
    title: 'Sintomas da Dengue',
    description: 'Febre alta, dor de cabeça, dor no corpo e manchas vermelhas na pele. Se sentir isso, conte para um adulto!',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
    icon: 'thermometer'
  },
  {
    id: 'curiosity-4',
    title: 'Malária',
    description: 'A malária é transmitida por outro tipo de mosquito e é comum em regiões com florestas e rios.',
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600',
    icon: 'trees'
  },
  {
    id: 'curiosity-5',
    title: 'Zika e Chikungunya',
    description: 'São doenças parecidas com a dengue, transmitidas pelo mesmo mosquito listrado!',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
    icon: 'virus'
  },
  {
    id: 'curiosity-6',
    title: 'Proteja sua Casa',
    description: 'Cubra caixas d\'água, limpe calhas e deixe garrafas viradas para baixo!',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
    icon: 'home'
  }
];

export const sponsors: Sponsor[] = [
  {
    id: 'sponsor-1',
    name: 'Ministério da Saúde',
    logo: 'https://via.placeholder.com/200x80/2196F3/FFFFFF?text=Minist%C3%A9rio+da+Sa%C3%BAde',
    link: 'https://www.gov.br/saude'
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Qual a cor do mosquito da dengue?',
    options: ['Todo preto', 'Preto com listras brancas', 'Todo branco', 'Verde'],
    correctAnswer: 1
  },
  {
    id: 'q2',
    question: 'Onde o mosquito coloca seus ovos?',
    options: ['Na terra', 'Na água parada', 'Nas plantas', 'No ar'],
    correctAnswer: 1
  },
  {
    id: 'q3',
    question: 'O que devemos fazer para prevenir a dengue?',
    options: ['Deixar água parada', 'Eliminar água parada', 'Plantar flores', 'Dormir cedo'],
    correctAnswer: 1
  },
  {
    id: 'q4',
    question: 'Quando o mosquito da dengue gosta de picar?',
    options: ['À noite', 'De madrugada', 'Durante o dia', 'Nunca'],
    correctAnswer: 2
  }
];
