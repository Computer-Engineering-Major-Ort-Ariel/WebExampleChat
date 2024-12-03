class Program
{
  static void Main()
  {
    string[] usernames = [];
    string[] passwords = [];
    string[] colors = [];
    string[] userIds = [];

    string[] messages = [];
    string[] messageUsernames = [];
    string[] messageColors = [];

    int port = 5000;

    var server = new Server(port);

    Console.WriteLine("The server is running");
    Console.WriteLine($"Main Page: http://localhost:{port}/website/pages/index.html");

    while (true)
    {
      (var request, var response) = server.WaitForRequest();

      Console.WriteLine($"Recieved a request with the path: {request.Path}");

      if (File.Exists(request.Path))
      {
        var file = new File(request.Path);
        response.Send(file);
      }
      else if (request.ExpectsHtml())
      {
        var file = new File("website/pages/404.html");
        response.SetStatusCode(404);
        response.Send(file);
      }
      else
      {
        try
        {
          if (request.Path == "signup") {
            (string username, string password, string color) = request.GetBody<(string, string, string)>();

            string userId = Guid.NewGuid().ToString();

            usernames = [..usernames, username];
            passwords = [..passwords, password];
            colors = [..colors, color];
            userIds = [..userIds, userId];

            response.Send(userId);
          }
          else if (request.Path == "login")
          {
            (string username, string password) = request.GetBody<(string, string)>();

            string? userId = null;

            Console.WriteLine(username + "+ " + password);

            for (int i = 0; i < userIds.Length; i++)
            {
              Console.WriteLine(usernames[i] + ", " + passwords[i]);
              if (username == usernames[i] && password == passwords[i])
              {
                userId = userIds[i];
              }
            }

            response.Send(userId);
          }
          else if (request.Path == "userExists") {
            string userId = request.GetBody<string>();

            bool userExists = false;
            for (int i = 0; i < userIds.Length; i++) {
              if (userId == userIds[i]) {
                userExists = true;
              }
            }

            response.Send(userExists);
          }
          else if (request.Path == "getUsername") {
            string userId = request.GetBody<string>();

            string username = "";
            for (int i = 0; i < userIds.Length; i++) {
              if (userIds[i] == userId) {
                username = usernames[i];
              }
            }

            response.Send(username);
          }
          else if (request.Path == "getMessages") {
            response.Send((messages, messageUsernames, messageColors));
          }
          else if (request.Path == "sendMessage") {
            (string userId, string message) = request.GetBody<(string, string)>();

            string messageUsername = "";
            string messageColor = "";

            for (int i = 0; i < userIds.Length; i++) {
              if (userId == userIds[i]) {
                messageUsername = usernames[i];
                messageColor = colors[i];
              }
            }

            messages = [..messages, message];
            messageUsernames = [..messageUsernames, messageUsername];
            messageColors = [..messageColors, messageColor];
          }
          else
          {
            response.SetStatusCode(405);
          }
        }
        catch (Exception exception)
        {
          Log.WriteException(exception);
        }
      }

      response.Close();
    }
  }
}