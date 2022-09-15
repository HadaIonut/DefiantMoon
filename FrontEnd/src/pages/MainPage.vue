<script setup lang="ts">
const players = ['Ionut', 'Claudiu', 'Marian', 'Bogdan', 'Ana', 'Cristi']
</script>

<template>
    <div class="page-container">
        <div class="login-form-container">
            <div class="input-container">
                <span>User Select</span>
                <select class="dropdown" name="player-selector">
                    <option v-for="player in players" :value="player" :key="player">{{ player }}</option>
                </select>
            </div>
            <div class="input-container">
                <span>User Password</span>
                <input class="input" type="password" placeholder="password">
            </div>

            <div class="join-container">
                <button class="button">Join Game</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.page-container {
    width: 100vw;
    height: 100vh;
    background: #00201E;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #DAD1C3;

}

.login-form-container {
    width: 70%;
    background: rgba(58, 82, 104,0.5);
    border: 1px solid #007F5F;
    padding: 16px;
    border-radius: 16px;
}

.dropdown {
    width: 70%;
    padding: 16px;
    background: transparent;
    border-radius: 12px;
    border: 1px solid #007F5F;
    color: #DAD1C3;

    & > option {
        background: #3A5268;
    }
}

.input {
    width: calc(70% - 16px);
    margin-top: 8px;
    background: transparent;
    border: 1px solid #007F5F;
    color: #DAD1C3;
    font-weight: bold;
    border-radius: 12px;
    padding: 16px 0 16px 16px;

    & > input {
        background: transparent;
        border: none;
    }
}

.input-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.join-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.button {
    padding: 16px;
    background: #00E88A;
    color: #00201E;
    border-radius: 12px;
    border: none;
    cursor: pointer;
}
</style>
