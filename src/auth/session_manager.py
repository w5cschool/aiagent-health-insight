import streamlit as st
from auth.auth_service import AuthService
from datetime import datetime, timedelta

class SessionManager:
    @staticmethod
    def init_session():
        if 'last_activity' not in st.session_state:
            st.session_state.last_activity = datetime.now()
        
        # Check for session timeout (30 minutes)
        if 'authenticated' in st.session_state and st.session_state.authenticated:
            if datetime.now() - st.session_state.last_activity > timedelta(minutes=30):
                SessionManager.logout()
                st.error("Session expired. Please login again.")
                st.rerun()
        
        st.session_state.last_activity = datetime.now()

        if 'auth_service' not in st.session_state:
            st.session_state.auth_service = AuthService()
        if 'authenticated' not in st.session_state:
            st.session_state.authenticated = False
        if 'user' not in st.session_state:
            st.session_state.user = None
        if 'current_session' not in st.session_state:
            st.session_state.current_session = None

    @staticmethod
    def login(email, password):
        success, user_data = st.session_state.auth_service.sign_in(email, password)
        if success and isinstance(user_data, dict):
            st.session_state.authenticated = True
            st.session_state.user = user_data
            return True, None
        return False, user_data

    @staticmethod
    def logout():
        success, error = st.session_state.auth_service.sign_out()
        if success:
            # Clear all session state
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            return True, None
        return False, error

    @staticmethod
    def is_authenticated():
        return st.session_state.get('authenticated', False)

    @staticmethod
    def create_chat_session(title=None):
        if st.session_state.user and 'id' in st.session_state.user:
            return st.session_state.auth_service.create_session(
                st.session_state.user['id'],
                title
            )
        return False, "User not authenticated"

    @staticmethod
    def get_user_sessions():
        if st.session_state.user and 'id' in st.session_state.user:
            return st.session_state.auth_service.get_user_sessions(
                st.session_state.user['id']
            )
        return False, []

    @staticmethod
    def delete_session(session_id):
        if not st.session_state.user or 'id' not in st.session_state.user:
            return False, "User not authenticated"
            
        try:
            success, error = st.session_state.auth_service.delete_session(session_id)
            if success:
                # Safely handle current_session clearing
                current_session = st.session_state.get('current_session')
                if current_session and isinstance(current_session, dict):
                    if current_session.get('id') == session_id:
                        st.session_state.current_session = None
            return success, error
        except Exception as e:
            return False, str(e)
