from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.task_list),
    path('tasks/create/', views.create_task),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
]