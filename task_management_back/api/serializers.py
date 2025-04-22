from rest_framework import serializers # type: ignore
from .models import Task, Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# In task_management_back/api/serializers.py
class TaskSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'owner', 'category', 'category_id', 'created_at']
        read_only_fields = ['id', 'created_at', 'owner']

# In task_management_back/api/serializers.py
class TaskCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Task
        fields = ['title', 'description', 'category_id']

    def create(self, validated_data):
        category_id = validated_data.pop('category_id', None)
        category = None
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                pass
        
        task = Task.objects.create(
            category=category,
            owner=self.context['request'].user,
            **validated_data
        )
        return task

class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)