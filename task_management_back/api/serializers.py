from rest_framework import serializers # type: ignore
from .models import Task, Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskCreateSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    category_id = serializers.IntegerField()

class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)