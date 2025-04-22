from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from django.contrib.auth import authenticate
from .models import Task, Category
from .serializers import TaskSerializer, TaskCreateSerializer, CategorySerializer

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    serializer = TaskCreateSerializer(data=request.data)
    if serializer.is_valid():
        Task.objects.create(
            title=serializer.validated_data['title'],
            description=serializer.validated_data['description'],
            category_id=serializer.validated_data['category_id'],
            owner=request.user
        )
        return Response({"message": "Task created"}, status=201)
    return Response(serializer.errors, status=400)
'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    # Используем сериализатор для валидации и создания задачи
    serializer = TaskCreateSerializer(data=request.data)

    if serializer.is_valid():
        # Создаем задачу через сериализатор (создание автоматически обработает данные)
        task = serializer.save(owner=request.user)  # 'owner' привязываем к текущему пользователю

        # Возвращаем успешный ответ с id созданной задачи
        return Response({
            "message": "Task created successfully",
            "task_id": task.id  # ID только что созданной задачи
        }, status=201)
    
    # В случае ошибки валидации возвращаем ошибки с кодом 400
    return Response(serializer.errors, status=400)

class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Task.objects.get(pk=pk, owner=user)
        except Task.DoesNotExist:
            return None

    def get(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({'error': 'Task not found'}, status=404)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({'error': 'Task not found'}, status=404)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({'error': 'Task not found'}, status=404)
        task.delete()
        return Response(status=204)


class LoginView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=401)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
