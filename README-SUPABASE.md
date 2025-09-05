# Integração com Supabase - Chofer em Londres

Este projeto foi integrado com o Supabase para gerenciar os dados de tours, agendamentos, contatos e transferências.

## Configuração

1. O arquivo `.env.local` já foi configurado com as credenciais do Supabase:
   - URL: https://zhxigmzsnnvvhqqkmcza.supabase.co
   - Chave anônima: Já configurada no arquivo

2. As tabelas necessárias já foram criadas no Supabase:
   - `tours`: Armazena informações sobre os tours disponíveis
   - `appointments`: Armazena agendamentos de tours
   - `contacts`: Armazena mensagens de contato
   - `transfers`: Armazena solicitações de transfer de aeroporto

## Migração de Dados

Para migrar os dados do arquivo `attractions.ts` para o Supabase, execute o script de migração:

```bash
pnpm tsx scripts/migrate-tours.ts
```

## Serviços Disponíveis

Os seguintes serviços foram implementados para interagir com o Supabase:

### Tour Service

```typescript
// Obter todos os tours
const tours = await getTours();

// Obter um tour específico por ID
const tour = await getTourById(id);

// Criar um agendamento
const result = await createAppointment({
  tour_id: "id-do-tour",
  customer_name: "Nome do Cliente",
  customer_email: "email@exemplo.com",
  customer_phone: "+5511999999999",
  appointment_date: "2025-06-01",
  appointment_time: "10:00:00",
  passengers: 2,
  special_requests: "Alguma solicitação especial"
});

// Criar um contato
const result = await createContact({
  name: "Nome do Cliente",
  email: "email@exemplo.com",
  phone: "+5511999999999",
  message: "Mensagem de contato",
  tour_id: "id-do-tour" // opcional
});

// Criar um transfer
const result = await createTransfer({
  customer_name: "Nome do Cliente",
  customer_email: "email@exemplo.com",
  customer_phone: "+5511999999999",
  transfer_date: "2025-06-01",
  transfer_time: "10:00:00",
  airport: "Heathrow",
  flight_number: "BA123",
  hotel_address: "Endereço do hotel",
  passengers: 2,
  special_requests: "Alguma solicitação especial"
});
```

## Estrutura de Arquivos

- `lib/supabase.ts`: Cliente do Supabase
- `types/supabase.ts`: Tipos gerados para o Supabase
- `services/tour-service.ts`: Serviços para interagir com o Supabase
- `scripts/migrate-tours.ts`: Script para migrar dados para o Supabase

## Próximos Passos

1. Implementar autenticação de usuários
2. Adicionar painel administrativo para gerenciar tours, agendamentos, contatos e transferências
3. Implementar notificações por email para novos agendamentos e contatos