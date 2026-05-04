<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class createService extends Command
{
    /**
     * The name and signature of the console command.
     * Example: php artisan make:service UserService --i --folder=User
     * @var string
     */
    protected $signature = 'make:service {name} {--i} {--folder=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comando para simplificar o trabalho de criação de interfaces e serviços';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fileName = $this->argument("name");

        $path = implode(DIRECTORY_SEPARATOR, ['app', 'Services']);
        $namespace = implode(DIRECTORY_SEPARATOR, ['App', 'Services']);

        if ($this->option("folder")) {
            $path .= DIRECTORY_SEPARATOR . $this->option("folder");
            $namespace .= DIRECTORY_SEPARATOR . $this->option("folder");
        }
        $serviceFilePath =  base_path($path . DIRECTORY_SEPARATOR . $fileName . ".php");


        if(File::exists($serviceFilePath)){
            $this->error("O serviço desejado '{$fileName}.php' já existe!");
            return;
        }

        $implementsInterfaceDirectory = null;

        if($this->option("i")){
            $implementsInterfaceDirectory = $this->createInterface(
                fileName: "I$fileName",
                folder: $this->option("folder")
            );
        }

        $implementsInterfaceDirectory = ($implementsInterfaceDirectory == null) ? "" : " implements " . DIRECTORY_SEPARATOR . $implementsInterfaceDirectory;

        File::makeDirectory(dirname($serviceFilePath), 0755, true, true);

        File::put($serviceFilePath, "<?php

namespace $namespace;

class $fileName$implementsInterfaceDirectory
{

}
        ");

        $this->info("Serviço criado em {$serviceFilePath}");
    }


    private function createInterface($fileName, $folder): string{

        $path = implode(DIRECTORY_SEPARATOR, ['app', 'Interfaces']);
        $namespace = implode(DIRECTORY_SEPARATOR, ['App', 'Interfaces']);

        if ($folder) {
            $path .= DIRECTORY_SEPARATOR . $this->option("folder");
            $namespace .= DIRECTORY_SEPARATOR . $this->option("folder");
        }
        $interfaceFilePath =  base_path($path . DIRECTORY_SEPARATOR . $fileName . ".php");

        if(File::exists($interfaceFilePath)){
            $this->error("A interface desejada '{$fileName}.php' já existe!");
            return $namespace . DIRECTORY_SEPARATOR . $fileName;
        }

        File::makeDirectory(dirname($interfaceFilePath), 0755, true, true);

        File::put($interfaceFilePath,
"<?php

namespace $namespace;

interface $fileName
{

}
        ");

        $this->info("Interface criada em {$interfaceFilePath}");
        return $namespace . DIRECTORY_SEPARATOR . $fileName;
    }
}
