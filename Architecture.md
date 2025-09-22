# API Design (v1)

## Principles
- Auth: Clerk Session -> Every query filters by userId
- Errors: Meaningful Codes Used on API Errors
- Input Validation: More Strict Checking with Zod Input Validator

## Error Model
```json
{"error": {"code": "VALIDATION ERROR", "message": "Name is required", "details": {"name": ["Too Short"]}}}
```

## Endpoints
### 1. Projects
#### POST ```/api/projects```
For Creating a Project
- Request: ```{"name": "My First Agent", "prompt": "Financial Expert"}```
- Response: ```{"id": "14561", "name": "My First Agent", "createdAt": "2025-09-22T14:05:00Z"}```

#### GET ```/api/projects```
Gets the list of projects
- Response: ```{ "items": [{ "id": "14561", "name": "My First Agent" }]}```

### 2. Prompt [One to One relation with Project]
#### GET ```/api/prompt?projectId=14561```
Gets the Prompt of the Project/Agent
- Response: ```{ "projectId": "14561", "content": "Financial Expert" }```

#### PUT ```/api/prompt```
Create/Update the prompt
- Request: ```{ "projectId": "14561", "content": "Mental Health Expert..." }```
- Response: ```{ "projectId": "14561", "content": "Mental Health Expert..." }```

### 3. Messages
#### GET ```/api/messages?projectId=14561```
Return Chat History with ascending by time order
- Response: ``` {
    "items": [
        { "id": "msg_1", "role": "user", "content": "Hello", "createdAt": "..." },
        { "id": "msg_2", "role": "assistant", "content": "Hi!", "createdAt": "..." }
    ]
}```

#### POST ```/api/messages```
Insert a user message [Assistant Messages come via /chat, this endpoint is part of the bigger post /api/chat]
- Request: ```{ "projectId": "14561", "content": "Summarize our last messages." }```
- Response: ```{ "id": "9", "role": "user", "content": "Summarize our last messages.", "createdAt": "..." }```

### 4. Chat
#### POST ```/api/chat```
End-to-end roundtrip: Insert User Message -> Build Context -> LLM Call -> Insert Assistant -> Return Reply
- Request: ```{ "projectId": "14561", "content": "Summarize our last messages." }```
- Response: ```{ "assistant": { "id": "10", "content": "Here's a summary..." } }```


# Zod Schemas
```
const createProject = z.object({ name: z.string().trim().min(1).max(80),
prompt: z.string().trim().min(1).max(40000) });
const projectId = z.string().min(1);

const insertPrompt = z.object({
  projectId: ProjectId,
  content: z.string().trim().max(40000)
});

const createUserMessage = z.object({
  projectId: ProjectId,
  content: z.string().trim().min(1).max(40000)
});

const ChatRequest = .object({
  projectId: ProjectId,
  content: z.string().trim().min(1).max(40000)
});
```
