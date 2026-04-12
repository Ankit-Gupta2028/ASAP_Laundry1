import streamlit as st

st.title("ASPA Laundry")

st.write("Welcome to Laundry System")

name = st.text_input("Enter your name")

if st.button("Submit"):
    st.success(f"Hello {name}")