from functools import wraps
from django.http import HttpResponseForbidden

def role_required(roles):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(self, request, *args, **kwargs):
            user = self.request.user
            if user.role in roles:
                return view_func(self, request, *args, **kwargs)
            else:
                return HttpResponseForbidden("You don't have the required role to access this page.")
        return _wrapped_view
    return decorator
