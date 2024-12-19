<template>
  <div class="social-page">
    <h1>Social Page</h1>
    
    <!-- Post Status Section -->
    <div class="post-status">
      <textarea v-model="newStatus" placeholder="What's on your mind?"></textarea>
      <o-field label="Tag Friends">
        <o-autocomplete
          v-model="selectedFriend"
          :options="friendOptions"
          rounded
          expanded
          placeholder="Type a friend's name"
          icon="search"
          clearable
          open-on-focus
          @input="fetchFriendSuggestions"
        >
          <template #empty>No results found</template>
        </o-autocomplete>
      </o-field>
      <div class="tagged-friends">
        <span v-for="friend in taggedFriends" :key="friend.id" class="tagged-friend">
          {{ friend.name }}
        </span>
      </div>
      <button @click="postStatus">Post</button>
    </div>

    <!-- Exercise Posts Feed -->
    <div class="status-feed">
      <h2>Exercise Posts</h2>
      <div v-for="post in exercisePosts" :key="post.id" class="post">
        <div class="post-content">
          <p>{{ post.content }}</p>
          <small>Posted by: {{ post.user }}</small>
          <small v-if="post.taggedFriends">Tagged: {{ post.taggedFriends }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { search } from '@/models/users'; // Adjust the import according to your folder structure
import { ref } from 'vue';

export default defineComponent({
  name: 'SocialPage',
  data() {
    return {
      newStatus: '',
      selectedFriend: '',
      friendOptions: [] as any[],
      taggedFriends: [] as any[],
      exercisePosts: [
        { id: 1, content: 'Just finished a 5k run!', user: 'Frank', taggedFriends: '' },
        { id: 2, content: 'Did 50 push-ups today!', user: 'Rachel', taggedFriends: '' },
        { id: 3, content: 'Completed a 10k run!', user: 'Max', taggedFriends: '' },
        { id: 4, content: 'Yoga session for 1 hour!', user: 'Chloe', taggedFriends: '' },
        // Add more sample posts here
      ],
    };
  },
  methods: {
    async fetchFriendSuggestions(query: string) {
      if (query.length < 2) {
        this.friendOptions = [];
        return;
      }

      try {
        const response = await search(query);
        if (response.isSuccess) {
          this.friendOptions = Array.isArray(response.data) ? response.data.map(user => ({ id: user.id, name: `${user.firstname} ${user.lastname}` })) : [];
        } else {
          console.error('Error fetching suggestions:', response.message);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    },
    postStatus() {
      if (this.newStatus.trim() !== '') {
        this.exercisePosts.push({
          id: this.exercisePosts.length + 1,
          content: this.newStatus,
          user: 'You', // Placeholder name for the current user
          taggedFriends: this.taggedFriends.map(friend => friend.name).join(', ')
        });
        this.newStatus = '';
        this.taggedFriends = [];
      }
    },
  },
  watch: {
    selectedFriend(newVal) {
      if (newVal) {
        const friend = this.friendOptions.find(option => option.name === newVal);
        if (friend && !this.taggedFriends.includes(friend)) {
          this.taggedFriends.push(friend);
        }
        this.selectedFriend = '';
      }
    }
  }
});
</script>

<style scoped>
.social-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.post-status {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1em;
}

button:hover {
  background-color: #0056b3;
}

.status-feed {
  margin-top: 20px;
}

h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2em;
}

.post {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-content {
  flex: 1;
}

.post p {
  margin: 0 0 10px;
  font-size: 1.1em;
}

.post small {
  color: #666;
  font-size: 0.9em;
}

.tagged-friends {
  margin-top: 10px;
}

.tagged-friend {
  display: inline-block;
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 20px;
  margin-right: 5px;
  font-size: 0.9em;
}
</style>